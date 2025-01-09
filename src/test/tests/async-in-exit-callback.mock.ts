import {addExitCallback} from '../../index.js';

addExitCallback(() => {
    console.info('this log works');
    new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
            console.info('this log does not work');
        }, 3000);
    });
});

process.exit(0);
