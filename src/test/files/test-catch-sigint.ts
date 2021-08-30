import {addExitCallback} from '../..';
import {noErrorExit} from '../test-util/no-error-exit';

addExitCallback(noErrorExit);

process.emit('SIGINT', 'SIGINT');
