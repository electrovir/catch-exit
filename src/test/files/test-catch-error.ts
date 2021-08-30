import {addExitCallback} from '../..';
import {noErrorExit} from '../test-util/no-error-exit';

addExitCallback(noErrorExit);

const errorObject: any = {};

errorObject.doesNotExist.noErrorShouldHappenHere;
