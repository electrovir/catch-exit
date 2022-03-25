import {catchSignalStrings, setupCatchExit} from '../..';

function countListeners(): {signal: string; count: number}[] {
    return catchSignalStrings
        .map((signalString) => {
            return {
                signal: signalString,
                count: process.listenerCount(signalString),
            };
        })
        .filter((mappedCount) => mappedCount.count);
}

const initialListeners = countListeners();
if (initialListeners.length) {
    console.error(initialListeners);
    throw new Error(`Listeners are already present!`);
}

setupCatchExit();

const afterListeners = countListeners();

if (afterListeners.length > catchSignalStrings.length) {
    console.error(afterListeners);
    throw new Error(`More listeners than necessary were attached`);
} else if (afterListeners.length < catchSignalStrings.length) {
    console.error(afterListeners);
    throw new Error(`Not enough listeners were attached`);
}
