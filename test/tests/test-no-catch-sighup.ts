import {setupCatchExit} from '../../src';

setupCatchExit();

process.emit('SIGHUP', 'SIGHUP');

// this line should not be called and thus the process should exit with a SIGHUP exit code
process.exit(5);
