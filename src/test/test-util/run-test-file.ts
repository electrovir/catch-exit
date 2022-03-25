import {interpolationSafeWindowsPath, runShellCommand} from 'augment-vir/dist/node-only';
import {existsSync} from 'fs';
import {join} from 'path';
import {testFileDir} from '../../file-paths';
import {TestDefinition} from './definition-type';

export async function runTestFile(test: TestDefinition): Promise<string> {
    let failureMessage = '';
    const testFilePath = join(testFileDir, test.testName + '.js');
    if (!existsSync(testFilePath)) {
        throw new Error(`Could not find test file at ${testFilePath}`);
    }
    const results = await runShellCommand(
        // directly run js files to avoid extra listeners getting attached from ts-node
        // this requires compiling first
        `node ${interpolationSafeWindowsPath(testFilePath)}`,
    );

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
    } else if (test.expected.logLength != undefined) {
        if (test.expected.inverse && logs.length === test.expected.logLength) {
            failureMessage = `expected output length to not be ${test.expected.logLength} but it was.`;
            console.error({fullLogs});
        } else if (!test.expected.inverse && logs.length !== test.expected.logLength) {
            failureMessage = `expected output length to be ${test.expected.logLength} but it was ${logs.length}.`;
            console.error({fullLogs});
        }
    } else {
        throw new Error(`No test expectation was defined for ${test.testName}`);
    }

    return failureMessage;
}
