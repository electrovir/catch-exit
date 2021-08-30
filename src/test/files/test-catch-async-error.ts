import {addExitCallback} from '../..';
import {noErrorExit} from '../test-util/no-error-exit';

addExitCallback(noErrorExit);

async function testAsyncFunction() {
    const errorObject: any = {};

    errorObject.doesNotExist.noErrorShouldHappenHere;
}

testAsyncFunction();
