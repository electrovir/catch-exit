import {defineConfig} from '@virmator/deps/configs/dep-cruiser.config.base';
import type {IConfiguration} from 'dependency-cruiser';

const baseConfig = defineConfig({
    fileExceptions: {
        // enter file exceptions by rule name here
        'no-orphans': {
            from: [
                'src/index.ts',
            ],
        },
        'no-deprecated-core': {
            to: [
                /**
                 * I tried Node.js's suggested alternatives and couldn't figure out how or if they
                 * can actually replace our usage of async_hooks.
                 */
                'async_hooks',
            ],
        },
    },
    omitRules: [
        // enter rule names here to omit
    ],
});

const depCruiserConfig: IConfiguration = {
    ...baseConfig,
};

module.exports = depCruiserConfig;
