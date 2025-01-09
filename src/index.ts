import {signalsByName} from 'human-signals';
import {createHook} from 'node:async_hooks';
import {writeSync} from 'node:fs';

/**
 * Add a callback function to be called upon process exit or death.
 *
 * @category Main
 * @returns The callback itself for chaining purposes.
 */
export function addExitCallback(
    /**
     * Typed to block async functions. Async functions will not work for 'exit' events, triggered
     * from process.exit(), but will work with other events this catches. If you wish to perform
     * async functions have this callback call an async function but remember it won't be awaited if
     * the signal is 'exit'.
     */
    callback: ExitCallback,
): ExitCallback {
    /** Only setup the exit handling once a callback has actually been added. */
    setupProcessExitHandling();
    callbacks.push(callback);
    return callback;
}

/**
 * Remove the given callback function from the set of previously added exit callbacks.
 *
 * @category Main
 * @returns The callback removed or `undefined` if the given callback was not found.
 */
export function removeExitCallback(
    /** The exact callback (by reference) to remove, previously added by {@link addExitCallback}. */
    callback: ExitCallback,
): ExitCallback | undefined {
    const index = callbacks.indexOf(callback);
    return index > -1 ? callbacks.splice(index, 1)[0] : undefined;
}

/**
 * If this callback is async, it won't actually complete or be awaited in some cases, like when
 * calling `process.exit()`.
 *
 * @category Internal
 */
export type ExitCallback = (
    signal: CatchSignals,
    exitCode?: number,
    error?: Error,
) => void | Promise<void>;

/**
 * Signals listened to by this package.
 *
 * @category Internal
 */
export const interceptedSignals = [
    'SIGHUP',
    /** Catches ctrl+c event. */
    'SIGINT',
    /** Catches "kill pid". */
    'SIGTERM',
    'SIGQUIT',
] as const;

/**
 * Signals that may be passed to {@link ExitCallback} as its `signal` argument.
 * `'unhandledRejection'` is not a part of this because those are all turned into
 * `'uncaughtException'` errors.
 *
 * @category Internal
 */
export const catchSignalStrings = [
    ...interceptedSignals,
    'exit',
    'uncaughtException',
] as const;

/**
 * Signals that may be passed to {@link ExitCallback} as its `signal` argument.
 * `'unhandledRejection'` is not a part of this because those are all turned into
 * `'uncaughtException'` errors.
 *
 * @category Internal
 */
export type CatchSignals = (typeof catchSignalStrings)[number];

function logError(value: string): void {
    writeSync(2, value);
}

const callbacks: ExitCallback[] = [];

/** I'm not sure what all the different async types mean but at least these don't seem to matter. */
const ignoredAsyncTypes = [
    'TTYWRAP',
    'SIGNALWRAP',
    'PIPEWRAP',
];

let asyncWarningAlreadyLogged = false;

const asyncHook = createHook({
    init(id, type) {
        if (!ignoredAsyncTypes.includes(type) && !asyncWarningAlreadyLogged) {
            asyncWarningAlreadyLogged = true;
            logError(
                "\nWarning: an async 'process.exit' callback was used; it will not run to completion as 'process.exit' will not complete async tasks.\nSee https://www.npmjs.com/package/catch-exit#async-warning for details.\n",
            );
        }
    },
});

/**
 * This is used to prevent attaching signal listeners multiple times (which isn't necessary and
 * actually causes issues).
 */
let alreadySetup = false;

/**
 * This is used to prevent double clean up (since the process.exit in exitHandler gets caught the
 * first time, firing exitHandler again).
 */
let alreadyExiting = false;

function stringifyError(error: unknown): string {
    if (error instanceof Error) {
        return (error.stack || error.toString()) + '\n';
    } else {
        return String(error);
    }
}

function setupProcessExitHandling(): void {
    if (alreadySetup) {
        return;
    }
    alreadySetup = true;

    function exitHandler(signal: CatchSignals, exitCode?: number, inputError?: Error): void {
        if (!alreadyExiting) {
            alreadyExiting = true;
            try {
                /** Only the exit signal has async issues. */
                if (signal === 'exit') {
                    asyncHook.enable();
                }
                callbacks.forEach((callback) => callback(signal, exitCode, inputError));
                asyncHook.disable();
            } catch (callbackError) {
                /**
                 * 7 here means there was an error in the exit handler, which there was if we got to
                 * this point.
                 */
                exitWithError(callbackError, 7);
            }
            if (inputError instanceof Error) {
                exitWithError(inputError, exitCode);
            } else {
                process.exit(exitCode);
            }
        }
    }

    /** Prevents all exit codes from being 7 when they shouldn't be. */
    function exitWithError(error: unknown, code?: number) {
        logError(stringifyError(error));
        process.exit(code);
    }

    interceptedSignals.forEach((signal) =>
        process.on(signal, () => {
            const signalNumber = signalsByName[signal].number;
            exitHandler(signal, 128 + signalNumber);
        }),
    );

    process.on('exit', (code) => {
        exitHandler('exit', code);
    });

    process.on('unhandledRejection', (reason) => {
        const error = reason instanceof Error ? reason : new Error(String(reason));
        error.name = 'UnhandledRejection';
        throw error;
    });

    process.on('uncaughtException', (error) => {
        exitHandler('uncaughtException', 1, error);
    });
}
