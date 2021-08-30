import {addExitCallback} from '../..';

addExitCallback(() => {
    throw new Error(`This error SHOULD get thrown`);
});

// this shouldn't help
addExitCallback(() => {
    process.exit(0);
});

// this shouldn't help either
process.exit(0);
