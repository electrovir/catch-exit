import {addExitCallback} from '../../index.js';

addExitCallback(() => {});

async function testAsyncFunction() {
    const errorObject: any = {};
    errorObject.doesNotExist['SHOULD have error here'];
}

testAsyncFunction();
