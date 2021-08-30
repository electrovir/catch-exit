import {readdir} from 'fs-extra';
import {testGroup} from 'test-vir';
import {definedTests} from './files-definitions';
import {testFileDir} from './files/index';
import {runTestFile} from './test-util/run-test-file';

testGroup(async (runTest) => {
    definedTests.forEach((test) => {
        runTest({
            description: test.testName,
            expect: true,
            test: async () => {
                return await runTestFile(test);
            },
        });
    });

    const testNames = definedTests.map((test) => test.testName);
    const testFiles = (await readdir(testFileDir))
        .filter((testFile) => testFile !== 'index.ts')
        .map((fileName) => fileName.replace(/\.[jt]s$/, ''));

    runTest({
        description: 'no test files are missing from test definitions',
        expect: [],
        test: async () => {
            const testFilesMissingTestDefinitions = testFiles.filter((testFile) => {
                !testNames.includes(testFile);
            });

            return testFilesMissingTestDefinitions;
        },
    });

    runTest({
        description: 'no test definitions are missing test files',
        expect: [],
        test: async () => {
            const testDefinitionsMissingFiles = testNames.filter((testName) => {
                return !testFiles.includes(testName);
            });

            return testDefinitionsMissingFiles;
        },
    });
});
