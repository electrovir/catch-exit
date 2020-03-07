import {addExitCallback} from '../src';

addExitCallback(() => {
    console.log('this log works');
    new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 3000);
    });
});

process.exit(0);
