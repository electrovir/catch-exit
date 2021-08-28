import {addExitCallback, removeExitCallback} from '../..';

let removedCallbackFired = false;

const callbackToRemove = () => {
    removedCallbackFired = true;
};

addExitCallback(callbackToRemove);
removeExitCallback(callbackToRemove);

addExitCallback(() => {
    if (removedCallbackFired) {
        throw new Error(`Test failed`);
    }
});

process.exit(0);
