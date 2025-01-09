import {addExitCallback} from '../../index.js';

addExitCallback(() => process.exit(0));

process.emit('SIGQUIT', 'SIGQUIT');
