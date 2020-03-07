import {addExitCallback} from '../src';
import {noErrorExit} from './test-definitions';

addExitCallback(noErrorExit);

process.emit('SIGQUIT', 'SIGQUIT');
