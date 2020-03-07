import {addExitCallback} from '../src';

addExitCallback(signal => {
    if (signal !== 'exit') {
        new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 3000);
        });
    }
});

process.exit(0);
