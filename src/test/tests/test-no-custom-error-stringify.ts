import {setupCatchExit} from '../..';

setupCatchExit();

const errorObject: any = {};
errorObject.doesNotExist['SHOULD have error here'];
