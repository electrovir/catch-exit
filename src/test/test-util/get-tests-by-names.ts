import {definedTests} from '../files-definitions';

export function getTestsByNames(names: string[]) {
    return names.map((name) => {
        const test = definedTests.find((test) => test.testName === name);
        if (test) {
            return test;
        } else {
            throw new Error(`No test with name ${name} found.`);
        }
    });
}
