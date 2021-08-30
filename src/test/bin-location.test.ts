import {existsSync, readFile} from 'fs-extra';
import {testGroup} from 'test-vir';

testGroup((runTest) => {
    const packageJsonPath = 'package.json';

    runTest({
        description: 'package.json file contains valid bin path',
        expect: true,
        test: async () => {
            const packageJson = JSON.parse((await readFile(packageJsonPath)).toString());

            const binDir = packageJson.main;

            return existsSync(binDir);
        },
    });
});
