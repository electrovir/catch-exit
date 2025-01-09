import {addExitCallback} from '../../index.js';

addExitCallback(() => {
    console.info('even though async stuff does not work, this at least seems to');
});

process.exit(0);
