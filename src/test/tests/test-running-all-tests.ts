import {readdirSync} from 'fs';
import {definedTests, TEST_FILE_DIR} from '../test-definitions';

const testedFiles = new Set(definedTests.map((test) => test.testName));

const allTestFiles = new Set(
    readdirSync(TEST_FILE_DIR).map((fileName) => {
        const split = fileName.split('.');
        if (!split.length) {
            throw new Error(`Failed to split file name: ${fileName}`);
        }
        return split[0]!;
    }),
);

const missingFiles: string[] = [];

allTestFiles.forEach((testFile) => {
    if (!testedFiles.has(testFile)) {
        missingFiles.push(testFile);
    }
});

if (missingFiles.length) {
    console.error(`Missing ${missingFiles.length} tests:`);
    console.error(missingFiles);
    process.exit(1);
}
