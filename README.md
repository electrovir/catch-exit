# catch-exit

Catch Node.js exit conditions, including errors and unhandled promise rejections.

-   Warns you of async exit callbacks (which won't complete as expected).
-   Returns proper error codes for the given signal or error source (for example `130` for the `SIGINT` signal or `7` for errors originating from your provided exit handlers).
-   Allows you to add and remove process exit, death, or error listeners.
-   Turns unhandled promise rejection warnings into errors.

Note that v2 and onwards of this package are ESM only.

## Install

```sh
npm install catch-exit
```

## Usage

This package is primarily used through its `addExitCallback` export:

<!-- example-link: src/examples/simple.example.ts -->

```TypeScript
import {addExitCallback} from 'catch-exit';

function mySyncCleanup() {}
async function myAsyncCleanup() {}

addExitCallback(mySyncCleanup);

/** Multiple callbacks can be registered. */
addExitCallback((signal) => {
    /** See the "Async Warning" part of the README for an explanation on async weirdness. */
    if (signal !== 'exit') {
        myAsyncCleanup();
    }
});
```

-   Read the full docs here: https://electrovir.github.io/catch-exit

## Async Warning

You may see the following logged to your terminal:

> Warning: an async 'process.exit' callback was used; it will not run to completion as 'process.exit' will not complete async tasks.

This means that you're creating async tasks from within an exit callback that is used in `process.exit`. `process.exit` does not allow async tasks to complete so your callbacks will not complete, contrary to what you might expect. To prevent this warning, wrap your async cleanup in an if statement that excludes `'exit'` signals from doing anything async:

<!-- example-link: src/examples/async.example.ts -->

```TypeScript
import {addExitCallback} from 'catch-exit';

async function myAsyncCleanup() {}

addExitCallback((signal) => {
    if (signal !== 'exit') {
        myAsyncCleanup();
    }
});
```
