import {definedTests} from './test-definitions';
import {join} from 'path';
import {readdirSync} from 'fs';

const testedFiles = new Set(definedTests.map(test => test.testName));

const excludedFiles = ['run-tests', 'test-definitions'];

const allTestFiles = new Set(
    readdirSync(join('dist', 'test'))
        .map(fileName => fileName.split('.')[0])
        .filter(fileName => !excludedFiles.includes(fileName)),
);

const missingFiles: string[] = [];

allTestFiles.forEach(testFile => {
    if (!testedFiles.has(testFile)) {
        missingFiles.push(testFile);
    }
});

if (missingFiles.length) {
    console.error(`Missing ${missingFiles.length} tests:`);
    console.error(missingFiles);
    process.exit(1);
}
