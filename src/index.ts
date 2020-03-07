import {signalsByName} from 'human-signals';
import {createHook} from 'async_hooks';
import {writeSync} from 'fs';

/**
 * Add a callback function to be called upon process exit or death.
 *
 * @param callback   The callback function with signature:
 *                   (signal: CatchSignals, exitCode?: number, error?: Error) => undefined | void
 *
 *                   Typed to block async functions. Async functions will not work for 'exit' events, triggered from
 *                   process.exit(), but will work with other events this catches.
 *                   If you wish to perform async functions have this callback call an async function but remember it
 *                   won't be awaited if the signal is 'exit'.
 * @returns the callback itself for chaining purposes.
 */
export function addExitCallback(callback: ExitCallback): ExitCallback {
    // setup the exit handling once a callback has actually been added
    setupProcessExitHandling();
    callbacks.push(callback);
    return callback;
}

/**
 * Remove the given callback function from the list of callbacks to be called on process exit or death.
 *
 * @param callback   The exact callback (exact by reference) added at some earlier point by addExitCallback.
 * @returns the callback removed or undefined if the given callback was not found.
 */
export function removeExitCallback(callback: ExitCallback): ExitCallback | undefined {
    // assume that at this point the user wants the handler to be setup
    setupProcessExitHandling();
    const index = callbacks.indexOf(callback);
    return index > -1 ? callbacks.splice(index, 1)[0] : undefined;
}

/**
 * This callback cannot be async because on process exit async calls can't be awaited and won't finish.
 * See documentation on addExitCallback for details.
 */
export type ExitCallback = (signal: CatchSignals, exitCode?: number, error?: Error) => void | undefined; // return type set to prevent passing in functions with Promise<void> return type

/**
 * Various different signals that can be passed to ExitCallback as "signal".
 * "unhandledRejection" is not a part of this because these are all turned into "uncaughtException" errors
 */
export type CatchSignals = InterceptedSignals | 'exit' | 'uncaughtException';
type InterceptedSignals = 'SIGINT' | 'SIGHUP' | 'SIGTERM' | 'SIGQUIT';

// used in the listener far setup below
const signals: InterceptedSignals[] = [
    'SIGHUP',
    // catches ctrl+c event
    'SIGINT',
    // catches "kill pid"
    'SIGTERM',
    'SIGQUIT',
];
/**
 * The different signal types that can be passed to the exit callback.
 */
export const catchSignalStrings: CatchSignals[] = [...signals, 'exit', 'uncaughtException'];

function stringifyError(error: Error): string {
    if (customStringifyError) {
        return customStringifyError(error);
    }

    return error.stack || error.toString();
}

/**
 * Allow customization of error message printing. Defaults to just printing the stack trace.
 *
 * @param errorStringifyFunction   function that accepts an error and returns a string
 */
export function registerStringifyError(errorStringifyFunction?: ErrorStringifyFunction): void {
    // assume that at this point the user wants the handler to be setup
    setupProcessExitHandling();
    customStringifyError = errorStringifyFunction;
}

/**
 * Used to create custom error logging.
 *
 * @param error    Error that was thrown that can be used in the string
 * @returns a string that will be printed as the error's stderr message
 */
export type ErrorStringifyFunction = (error: Error) => string;
let customStringifyError: undefined | ErrorStringifyFunction;

/**
 * Options to be configured immediately on setup instead of set later by their respective functions.
 */
export type SetupOptions = {
    /**
     * Enables logging immediately on setup
     */
    loggingEnabled?: boolean;
    /**
     * Defines a custom error stringify function immediately on setup
     */
    customErrorStringify?: ErrorStringifyFunction;
};

/**
 * Setup process exit or death handlers without adding any callbacks
 *
 * @param options    setup options, see SetupOptions type for details
 */
export function setupCatchExit(options?: SetupOptions): void {
    setupProcessExitHandling();

    if (options) {
        const {loggingEnabled, customErrorStringify} = options;

        if (customErrorStringify) {
            registerStringifyError(customErrorStringify);
        }
        if (loggingEnabled) {
            enableLogging();
        }
    }
}

let loggingEnabled = false;
/**
 * Enable logging of this package's methods.
 *
 * @param enable   true (default) to enable, false to disable
 * @returns the value of the passed or defaulted "enable" argument
 */
export function enableLogging(enable = true): boolean {
    // assume that at this point the user wants the handler to be setup
    setupProcessExitHandling();
    loggingEnabled = enable;
    return enable;
}

// console.log is async and these log functions must be sync
function log(value: string): void {
    if (loggingEnabled) {
        writeSync(1, value);
    }
}
function logError(value: string): void {
    writeSync(2, value);
}

const callbacks: ExitCallback[] = [];
// not sure what all the different async types mean but I seem to not care about at least these
const ignoredAsyncTypes = ['TTYWRAP', 'SIGNALWRAP', 'PIPEWRAP'];

const asyncHook = createHook({
    init(id, type) {
        if (!ignoredAsyncTypes.includes(type)) {
            writeSync(
                2,
                `\nERROR: Async operation of type "${type}" was created in "process.exit" callback. This will not run to completion as "process.exit" will not complete async tasks.\n`,
            );
        }
    },
});

let alreadySetup = false;

/**
 * This is used to prevent double clean up (since the process.exit in exitHandler gets caught the first time, firing
 * exitHandler again).
 */
let alreadyExiting = false;

function setupProcessExitHandling(): void {
    if (alreadySetup) {
        return;
    }
    // so the program will not close instantly
    // process.stdin.resume();
    function exitHandler(signal: CatchSignals, exitCode?: number, inputError?: Error): void {
        log(`handling signal: ${signal} with code ${exitCode}`);
        if (!alreadyExiting) {
            log('setting alreadyExiting');
            alreadyExiting = true;
            try {
                log(`Firing ${callbacks.length} callbacks`);
                // only exit prevents async callbacks from completing
                if (signal === 'exit') {
                    asyncHook.enable();
                }
                callbacks.forEach(callback => callback(signal, exitCode, inputError));
                asyncHook.disable();
            } catch (callbackError) {
                log('Error in callback');
                // 7 here means there was an error in the exit handler, which there was if we got to this point
                exitWithError(callbackError, 7);
            }
            if (inputError instanceof Error) {
                exitWithError(inputError, exitCode);
            } else {
                process.exit(exitCode);
            }
        } else {
            log('Already exiting, not doing anything');
            return;
        }
    }

    // prevents all exit codes from being 7 when they shouldn't be
    function exitWithError(error: Error, code?: number) {
        log(`Exiting with error and code ${code}`);
        logError(stringifyError(error));
        process.exit(code);
    }

    signals.forEach(signal =>
        process.on(signal, () => {
            exitHandler(signal, 128 + signalsByName[signal].number);
        }),
    );

    process.on('exit', code => {
        log(`exit listener with code ${code}`);
        exitHandler('exit', code);
    });

    process.on('unhandledRejection', reason => {
        log('unhandledRejection listener');
        const error = reason instanceof Error ? reason : new Error(reason ? `${reason}` : '');
        error.name = 'UnhandledRejection';
        throw error;
    });

    // catches uncaught exceptions
    process.on('uncaughtException', error => {
        log('uncaughtException listener');
        exitHandler('uncaughtException', 1, error);
    });
}
