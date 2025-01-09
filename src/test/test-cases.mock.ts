export type TestCase = {
    testName: string;
    expected: {
        exitCode?: number;

        logLength?: number;
        /** Append stderr with stdout when checking logLength */
        includeStderr?: boolean;

        // flips the expectation
        // for example, if exitCode is defined, then the test will pass if it does NOT exit with exitCode
        inverse?: boolean;
    };
};

export const definedTests: TestCase[] = [
    {
        testName: 'add-remove-callback',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'async-in-exit-callback',
        expected: {
            logLength: 0,
            inverse: true,
            includeStderr: true,
        },
    },
    {
        testName: 'console-log-in-exit-callback',
        expected: {
            logLength: 0,
            inverse: true,
        },
    },
    {
        testName: 'no-async-in-exit-callback',
        expected: {
            logLength: 0,
            includeStderr: true,
        },
    },
    {
        testName: 'no-catch-callback-error',
        expected: {
            exitCode: 7,
        },
    },
    {
        testName: 'catch-error',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'no-catch-error',
        expected: {
            exitCode: 1,
        },
    },
    {
        testName: 'catch-async-error',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'no-catch-async-error',
        expected: {
            exitCode: 1,
        },
    },
    {
        testName: 'catch-sigterm',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'no-catch-sigterm',
        expected: {
            exitCode: 143,
        },
    },
    {
        testName: 'catch-sighup',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'no-catch-sighup',
        expected: {
            exitCode: 129,
        },
    },
    {
        testName: 'catch-sigquit',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'no-catch-sigquit',
        expected: {
            exitCode: 131,
        },
    },
    {
        testName: 'catch-sigint',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'no-catch-sigint',
        expected: {
            exitCode: 130,
        },
    },
    {
        testName: 'no-logging',
        expected: {
            logLength: 0,
        },
    },
    {
        testName: 'no-custom-error-stringify',
        expected: {
            logLength: 0,
            inverse: true,
            includeStderr: true,
        },
    },
    {
        testName: 'listener-count',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'get-tests-by-name',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'get-tests-by-name',
        expected: {
            exitCode: 0,
        },
    },
    {
        testName: 'setting-up-tons',
        expected: {
            logLength: 0,
            includeStderr: true,
        },
    },
];
