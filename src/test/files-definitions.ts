import {TestDefinition} from './test-util/definition-type';

export const definedTests: TestDefinition[] = [
    {
        testName: 'test-add-remove-callback',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'test-async-in-exit-callback',
        expected: {
            logLength: 0,
            inverse: true,
            includeStderr: true,
        },
    },
    {
        testName: 'test-console-log-in-exit-callback',
        expected: {
            logLength: 0,
            inverse: true,
        },
    },
    {
        testName: 'test-no-async-in-exit-callback',
        expected: {
            logLength: 0,
            includeStderr: true,
        },
    },
    {
        testName: 'test-no-catch-callback-error',
        expected: {
            exitCode: 7,
        },
    },
    {
        testName: 'test-catch-error',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'test-no-catch-error',
        expected: {
            exitCode: 1,
        },
    },
    {
        testName: 'test-catch-async-error',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'test-no-catch-async-error',
        expected: {
            exitCode: 1,
        },
    },
    {
        testName: 'test-catch-sigterm',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'test-no-catch-sigterm',
        expected: {
            exitCode: 143,
        },
    },
    {
        testName: 'test-catch-sighup',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'test-no-catch-sighup',
        expected: {
            exitCode: 129,
        },
    },
    {
        testName: 'test-catch-sigquit',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'test-no-catch-sigquit',
        expected: {
            exitCode: 131,
        },
    },
    {
        testName: 'test-catch-sigint',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'test-no-catch-sigint',
        expected: {
            exitCode: 130,
        },
    },
    {
        testName: 'test-enable-logging',
        expected: {
            logLength: 0,
            inverse: true,
        },
    },
    {
        testName: 'test-no-logging',
        expected: {
            logLength: 0,
        },
    },
    {
        testName: 'test-error-gets-logged',
        expected: {
            logLength: 0,
            inverse: true,
            includeStderr: true,
        },
    },
    {
        testName: 'test-disable-logging',
        expected: {
            logLength: 0,
        },
    },
    {
        testName: 'test-custom-error-stringify',
        expected: {
            logLength: 0,
            includeStderr: true,
            inverse: true,
        },
    },
    {
        testName: 'test-empty-custom-error-stringify',
        expected: {
            logLength: 0,
            includeStderr: true,
        },
    },
    {
        testName: 'test-no-custom-error-stringify',
        expected: {
            logLength: 0,
            inverse: true,
            includeStderr: true,
        },
    },
    {
        testName: 'test-listener-count',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'test-get-tests-by-name',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'test-get-tests-by-name',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'test-setting-up-tons',
        expected: {
            logLength: 0,
            includeStderr: true,
        },
    },
];
