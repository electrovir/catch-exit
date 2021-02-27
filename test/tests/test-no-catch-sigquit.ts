import {setupCatchExit} from '../../src';

setupCatchExit();

process.emit('SIGQUIT', 'SIGQUIT');

// this line should not be called and thus the process should exit with a SIGQUIT exit code
process.exit(5);
