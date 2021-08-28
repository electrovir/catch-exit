import {addExitCallback} from '../..';
import {noErrorExit} from '../test-definitions';

addExitCallback(noErrorExit);

const errorObject: any = {};

errorObject.doesNotExist.noErrorShouldHappenHere;
