export type TestDefinition = {
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
