import {setupCatchExit} from '../src';

setupCatchExit();

const errorObject: any = {};
errorObject.doesNotExist['SHOULD have error here'];
