import {addExitCallback} from '../../index.js';

addExitCallback(() => process.exit(0));

async function testAsyncFunction() {
    const errorObject: any = {};

    errorObject.doesNotExist.noErrorShouldHappenHere;
}

testAsyncFunction();
