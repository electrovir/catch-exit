import {addExitCallback} from '../../index.js';

addExitCallback(() => process.exit(0));

const errorObject: any = {};

errorObject.doesNotExist.noErrorShouldHappenHere;
