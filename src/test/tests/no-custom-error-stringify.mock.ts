import {addExitCallback} from '../../index.js';

addExitCallback(() => {});

const errorObject: any = {};
errorObject.doesNotExist['SHOULD have error here'];
