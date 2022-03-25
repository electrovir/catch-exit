import {readdir} from 'fs/promises';
import {testFileDir} from '../file-paths';
import {definedTests} from './files-definitions';
import {runTestFile} from './test-util/run-test-file';

describe('file tests', () => {
    definedTests.forEach((test) => {
        it(test.testName, async () => {
            expect(await runTestFile(test)).toBe('');
        });
    });

    async function getTests() {
        const testNames = definedTests.map((test) => test.testName);
        const testFiles = (await readdir(testFileDir))
            .filter((testFile) => testFile !== 'index.ts')
            .map((fileName) => fileName.replace(/\.[jt]s$/, ''));

        return {testNames, testFiles};
    }

    it('should have corresponding test names for every test file', async () => {
        const {testFiles, testNames} = await getTests();

        const testFilesMissingTestDefinitions = testFiles.filter((testFile) => {
            !testNames.includes(testFile);
        });

        expect(testFilesMissingTestDefinitions).toEqual([]);
    });

    it('', async () => {
        const {testFiles, testNames} = await getTests();
        const testDefinitionsMissingFiles = testNames.filter((testName) => {
            return !testFiles.includes(testName);
        });

        expect(testDefinitionsMissingFiles).toEqual([]);
    });
});
