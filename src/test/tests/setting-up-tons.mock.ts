import {addExitCallback} from '../../index.js';

/** Setting up catch-exit many times should not cause `MaxListenersExceededWarning` */

for (let i = 0; i < 25; i++) {
    addExitCallback(() => {});
}
