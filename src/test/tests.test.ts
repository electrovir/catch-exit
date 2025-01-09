import {assert} from '@augment-vir/assert';
import {interpolationSafeWindowsPath, runShellCommand} from '@augment-vir/node';
import {describe, it} from '@augment-vir/test';
import {existsSync} from 'node:fs';
import {readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {testFilesDirPath} from './file-paths.mock.js';
import {definedTests, type TestCase} from './test-cases.mock.js';

describe('file tests', () => {
    definedTests.forEach((test) => {
        it(test.testName, async () => {
            assert.strictEquals(await runTestFile(test), '');
        });
    });

    async function getTests() {
        const testNames = definedTests.map((test) => test.testName);
        const testFiles = (await readdir(testFilesDirPath))
            .filter((testFile) => testFile !== 'index.ts')
            .map((fileName) => fileName.replace('.mock.ts', ''));

        return {testNames, testFiles};
    }

    it('has a test case for every test file', async () => {
        const {testFiles, testNames} = await getTests();

        const testFilesMissingTestCases = testFiles.filter((testFile) => {
            return !testNames.includes(testFile);
        });

        assert.deepEquals(testFilesMissingTestCases, []);
    });

    it('has a test file for every test case', async () => {
        const {testFiles, testNames} = await getTests();
        const testCasesMissingFiles = testNames.filter((testName) => {
            return !testFiles.includes(testName);
        });

        assert.deepEquals(testCasesMissingFiles, []);
    });
});

async function runTestFile(test: Readonly<TestCase>): Promise<string> {
    let failureMessage = '';
    const testFilePath = join(testFilesDirPath, test.testName + '.mock.ts');
    if (!existsSync(testFilePath)) {
        throw new Error(`Could not find test file at ${testFilePath}`);
    }
    const results = await runShellCommand(`tsx ${interpolationSafeWindowsPath(testFilePath)}`, {
        hookUpToConsole: true,
    });

    const logs = test.expected.includeStderr ? results.stdout + results.stderr : results.stdout;
    const fullLogs = results.stdout + results.stderr;

    if (test.expected.exitCode != undefined) {
        if (test.expected.inverse && results.exitCode === test.expected.exitCode) {
            failureMessage = `expected exit code to not be ${test.expected.exitCode} but it was.`;
            console.error({fullLogs});
        } else if (!test.expected.inverse && results.exitCode !== test.expected.exitCode) {
            failureMessage = `expected exit code to be ${test.expected.exitCode} but it was ${results.exitCode}.`;
            console.error({fullLogs});
        }
    } else if (test.expected.logLength == undefined) {
        throw new Error(`No test expectation was defined for ${test.testName}`);
    } else if (test.expected.inverse && logs.length === test.expected.logLength) {
        failureMessage = `expected output length to not be ${test.expected.logLength} but it was.`;
        console.error({fullLogs});
    } else if (!test.expected.inverse && logs.length !== test.expected.logLength) {
        failureMessage = `expected output length to be ${test.expected.logLength} but it was ${logs.length}.`;
        console.error({fullLogs});
    }

    return failureMessage;
}
