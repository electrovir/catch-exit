import {addExitCallback} from '../src';
import {noErrorExit} from './test-definitions';

addExitCallback(noErrorExit);

async function testAsyncFunction() {
    const errorObject: any = {};

    errorObject.doesNotExist.noErrorShouldHappenHere;
}

testAsyncFunction();
