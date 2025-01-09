import {addExitCallback} from '../index.js';

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
