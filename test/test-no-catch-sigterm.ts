import {setupCatchExit} from '../src';

setupCatchExit();

process.emit('SIGTERM', 'SIGTERM');

// this line should not be called and thus the process should exit with a SIGTERM exit code
process.exit(5);
