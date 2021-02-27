import {addExitCallback} from '../../src';
import {noErrorExit} from '../test-definitions';

addExitCallback(noErrorExit);

const errorObject: any = {};

errorObject.doesNotExist.noErrorShouldHappenHere;
