import {registerStringifyError} from '../src';

registerStringifyError(() => 'YES THIS IS ERROR');

const errorObject: any = {};
errorObject.doesNotExist['SHOULD have error here'];
