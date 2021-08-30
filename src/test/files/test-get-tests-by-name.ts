import {definedTests} from '../files-definitions';
import {getTestsByNames} from '../test-util/get-tests-by-names';

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
