import {addExitCallback} from '../../index.js';

addExitCallback(() => {
    throw 'wrong';
});
