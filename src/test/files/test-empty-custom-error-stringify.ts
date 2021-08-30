import {registerStringifyError} from '../..';

registerStringifyError(() => '');

const errorObject: any = {};
errorObject.doesNotExist['SHOULD have error here'];
