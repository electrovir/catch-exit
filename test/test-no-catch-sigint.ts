import {setupCatchExit} from '../src';

setupCatchExit();

process.emit('SIGINT', 'SIGINT');

// this line should not be called and thus the process should exit with a SIGINT exit code
process.exit(5);
