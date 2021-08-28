import {addExitCallback} from '../..';

addExitCallback((signal) => {
    if (signal !== 'exit') {
        new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 3000);
        });
    }
});

process.exit(0);
