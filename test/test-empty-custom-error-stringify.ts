import {registerStringifyError} from '../src';

registerStringifyError(() => '');

const errorObject: any = {};
errorObject.doesNotExist['SHOULD have error here'];
