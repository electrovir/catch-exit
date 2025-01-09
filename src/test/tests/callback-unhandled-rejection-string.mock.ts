import {addExitCallback} from '../../index.js';

addExitCallback(() => {});

async function testAsyncFunction() {
    await new Promise((resolve, reject) => {
        reject('wrong');
    });
}

testAsyncFunction();
