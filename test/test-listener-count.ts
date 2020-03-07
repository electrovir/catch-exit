import {catchSignalStrings, setupCatchExit} from '../src';

function countListeners(): number {
    return catchSignalStrings.reduce((combined, signalString) => combined + process.listenerCount(signalString), 0);
}

if (countListeners() > 0) {
    throw new Error(`Listeners are already present!`);
}

setupCatchExit();

if (countListeners() > catchSignalStrings.length) {
    throw new Error(`More listeners than necessary were attached`);
} else if (countListeners() < catchSignalStrings.length) {
    throw new Error(`Not enough listeners were attached`);
}
