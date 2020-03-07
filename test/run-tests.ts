import {exec} from 'child_process';
import {join} from 'path';
import {TestDefinition, definedTests, getTestsByNames} from './test-definitions';

const TEST_FILE_DIR = 'dist/test';

type ShellResult = {
    error: undefined | Error;
    stderr: string;
    stdout: string;
    exitCode: number;
};

async function runShellCommand(command: string): Promise<ShellResult> {
    return new Promise<ShellResult>(async resolve => {
        let execCallbackPromiseResolve: (value?: ShellResult) => void = () => {};
        const execCallbackPromise = new Promise<ShellResult>(resolve => (execCallbackPromiseResolve = resolve));
        let closePromiseResolve: (value?: Partial<ShellResult>) => void = () => {};
        const closePromise = new Promise<Partial<ShellResult>>(resolve => (closePromiseResolve = resolve));

        const child = exec(command, (error, stdout, stderr) => {
            execCallbackPromiseResolve({
                error: error || undefined,
                stdout,
                stderr,
                exitCode: -1,
            });
        });
        child.on('close', exitCode => {
            closePromiseResolve({error: undefined, stdout: undefined, stderr: undefined, exitCode});
        });

        resolve(
            (await Promise.all([execCallbackPromise, closePromise])).reduce(
                (combined: Partial<ShellResult>, current) => {
                    return mergeDefinedProperties(combined, current);
                },
                {},
            ) as ShellResult,
        );
    });
}

function mergeDefinedProperties<T extends object, U extends object>(original: T, override: U): T & Partial<U> {
    const starter: T & Partial<U> = {...original};
    return getObjectTypedKeys(override)
        .filter(key => override[key] != undefined)
        .reduce((combined, key) => {
            combined[key] = override[key] as any;
            return combined;
        }, starter);
}

function getObjectTypedKeys<T extends object>(input: T): (keyof T)[] {
    return Object.keys(input) as (keyof T)[];
}

async function runTestFile(test: TestDefinition, logging: boolean): Promise<boolean> {
    if (logging) {
        console.log(`${test.testName}:`);
    }

    let failureMessage = '';
    const results = await runShellCommand(`node ${join(TEST_FILE_DIR, test.testName + '.js')}`);

    if (test.expected.exitCode != undefined) {
        if (test.expected.inverse && results.exitCode === test.expected.exitCode) {
            failureMessage = `expected exit code to not be ${test.expected.exitCode} but it was.`;
        } else if (!test.expected.inverse && results.exitCode !== test.expected.exitCode) {
            failureMessage = `expected exit code to be ${test.expected.exitCode} but it was ${results.exitCode}.`;
        }
    } else if (test.expected.logLength != undefined) {
        const logs = test.expected.includeStderr ? results.stdout + results.stderr : results.stdout;

        if (test.expected.inverse && logs.length === test.expected.logLength) {
            failureMessage = `expected output length to not be ${test.expected.logLength} but it was.`;
        } else if (!test.expected.inverse && logs.length !== test.expected.logLength) {
            failureMessage = `expected output length to be ${test.expected.logLength} but it was ${logs.length}.`;
        }
    } else {
        throw new Error(`No test expectation was defined for ${test.testName}`);
    }

    if (failureMessage) {
        if (logging) {
            console.error(results);
            console.error(`\tFailed: ${failureMessage}`);
        }
        return false;
    } else {
        if (logging) {
            console.log(`\tPassed.\n`);
        }
        return true;
    }
}

async function runAllTests(tests: TestDefinition[], logging = true) {
    if (!tests.length) {
        console.log(`No tests defined.`);
        process.exit(1);
    }

    const failures = await tests.reduce(
        async (combined, test) => {
            return (await combined) + Number(!(await runTestFile(test, logging)));
        },
        new Promise<number>(resolve => resolve(0)),
    );

    if (failures) {
        console.log(`${failures} tests failed.`);
        process.exit(1);
    } else {
        console.log(`All tests passed.`);
        process.exit(0);
    }
}

const args = process.argv.slice(2);

if (args.length) {
    runAllTests(getTestsByNames(args));
} else {
    runAllTests(definedTests);
}
