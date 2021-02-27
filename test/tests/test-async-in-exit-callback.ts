import {addExitCallback} from '../../src';

addExitCallback(() => {
    console.log('this log works');
    new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, 3000);
    });
});

process.exit(0);
