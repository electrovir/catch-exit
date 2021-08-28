import {addExitCallback} from '../..';
import {noErrorExit} from '../test-definitions';

addExitCallback(noErrorExit);

process.emit('SIGHUP', 'SIGHUP');
