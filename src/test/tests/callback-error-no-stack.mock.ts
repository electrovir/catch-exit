import {addExitCallback} from '../../index.js';

addExitCallback(() => {
    const error = new Error('failure');
    delete error.stack;
    throw error;
});
