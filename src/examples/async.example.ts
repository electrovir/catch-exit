import {addExitCallback} from '../index.js';

async function myAsyncCleanup() {}

addExitCallback((signal) => {
    if (signal !== 'exit') {
        myAsyncCleanup();
    }
});
