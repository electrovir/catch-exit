import {definedTests} from '../test-cases.mock.js';

function getTestsByNames(names: string[]) {
    return names.map((name) => {
        const test = definedTests.find((test) => test.testName === name);
        if (test) {
            return test;
        } else {
            throw new Error(`No test with name ${name} found.`);
        }
    });
}

if (getTestsByNames(definedTests.map((test) => test.testName)).length !== definedTests.length) {
    throw new Error(`Not able to get all tests by name!`);
}
try {
    getTestsByNames(['there is no test in existence with this name']);
    // above line should fail
    process.exit(1);
} catch (error) {
    process.exit(0);
}
