import {setupCatchExit} from '../../src';

setupCatchExit();

async function testAsyncFunction() {
    const errorObject: any = {};
    errorObject.doesNotExist['SHOULD have error here'];
}

testAsyncFunction();
