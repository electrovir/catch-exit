[![tests](https://github.com/electrovir/catch-exit/actions/workflows/virmator-tests.yml/badge.svg?branch=master)](https://github.com/electrovir/catch-exit/actions/workflows/virmator-tests.yml)

# catch-exit

Catch Node.js exit conditions, including errors and unhandled rejections.

## Features:

-   Turns unhandled promise rejection warnings into errors
-   Built with Typescript (has proper type exports)
-   Notifies user of async exit callbacks (which won't complete)
-   Returns proper error codes for the given signal or error source (for example `130` for the `SIGINT` signal or `7` for errors originating from your provided exit handlers)
-   Allows adding and removing callbacks on process exit or death
-   Allows custom error-to-string function
-   Allows enabling of logging for deeper debugging

Officially supported on Node.js versions > `12.x` but probably works on any version > `8.x`. (A dev dependency doesn't work < `12.x` which isn't included when installing via npm.)

# Examples

There are [many examples within test files](https://github.com/electrovir/catch-exit/tree/master/test).

# Usage

Install:

```sh
npm install catch-exit
```

```javascript
import {addExitCallback} from 'catch-exit';

addExitCallback(yourCleanUpCallback);
// multiple callbacks can be registered
addExitCallback((signal) => {
    // see Async error section of README below for why you might need to do this
    if (signal !== 'exit') {
        yourAsyncCleanUpCallback();
    }
});
```

# Documentation

This is just copied straight from the type declaration file generated from [src/index.ts](https://github.com/electrovir/catch-exit/blob/master/src/index.ts).

If _any_ of the exported functions are called, all the exit and death listeners are attached.

```typescript
/**
 * Add a callback function to be called upon process exit or death.
 *
 * @param callback The callback function with signature: (signal: CatchSignals, exitCode?: number,
 *   error?: Error) => undefined | void
 *
 *   Typed to block async functions. Async functions will not work for 'exit' events, triggered from
 *   process.exit(), but will work with other events this catches. If you wish to perform async
 *   functions have this callback call an async function but remember it won't be awaited if the
 *   signal is 'exit'.
 * @returns The callback itself for chaining purposes.
 */
export declare function addExitCallback(callback: ExitCallback): ExitCallback;
/**
 * Remove the given callback function from the list of callbacks to be called on process exit or death.
 *
 * @param callback The exact callback (exact by reference) added at some earlier point by addExitCallback.
 * @returns The callback removed or undefined if the given callback was not found.
 */
export declare function removeExitCallback(callback: ExitCallback): ExitCallback | undefined;
/**
 * This callback cannot be async because on process exit async calls can't be awaited and won't
 * finish. See documentation on addExitCallback for details.
 */
export declare type ExitCallback = (
    signal: CatchSignals,
    exitCode?: number,
    error?: Error,
) => void | undefined;
/**
 * Various different signals that can be passed to ExitCallback as "signal". "unhandledRejection" is
 * not a part of this because these are all turned into "uncaughtException" errors
 */
export declare type CatchSignals = InterceptedSignals | 'exit' | 'uncaughtException';
declare type InterceptedSignals = 'SIGINT' | 'SIGHUP' | 'SIGTERM' | 'SIGQUIT';
/** The different signal types that can be passed to the exit callback. */
export declare const catchSignalStrings: CatchSignals[];
/**
 * Allow customization of error message printing. Defaults to just printing the stack trace.
 *
 * @param errorStringifyFunction Function that accepts an error and returns a string
 */
export declare function registerStringifyError(
    errorStringifyFunction?: ErrorStringifyFunction,
): void;
/**
 * Used to create custom error logging.
 *
 * @param error Error that was thrown that can be used in the string
 * @returns A string that will be printed as the error's stderr message
 */
export declare type ErrorStringifyFunction = (error: Error) => string;
/** Options to be configured immediately on setup instead of set later by their respective functions. */
export declare type SetupOptions = {
    /** Enables logging immediately on setup */
    loggingEnabled?: boolean;
    /** Defines a custom error stringify function immediately on setup */
    customErrorStringify?: ErrorStringifyFunction;
};
/**
 * Setup process exit or death handlers without adding any callbacks
 *
 * @param options Setup options, see SetupOptions type for details
 */
export declare function setupCatchExit(options?: SetupOptions): void;
/**
 * Enable logging of this package's methods.
 *
 * @param enable True (default) to enable, false to disable
 * @returns The value of the passed or defaulted "enable" argument
 */
export declare function enableLogging(enable?: boolean): boolean;
```

# Async error

If you see the following:

> ERROR: Async operation of type "..." was created in "process.exit" callback

This means that you're making async calls from within a callback that is used in `process.exit`. `process.exit` doesn't allow async execution to complete so your callbacks will not complete like you expect. To prevent this error getting logged, wrap your task creations in an if statement that excludes `'exit'` signals from doing anything async:

```typescript
import {addExitCallback} from 'catch-exit';

addExitCallback((signal) => {
    if (signal !== 'exit') {
        new Promise((resolve) => {
            // do async stuff
            resolve();
        });
    }
});
```
