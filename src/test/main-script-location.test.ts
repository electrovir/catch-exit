import {existsSync, readFile} from 'fs-extra';
import {testGroup} from 'test-vir';

testGroup((runTest) => {
    const packageJsonPath = 'package.json';

    runTest({
        description: 'package.json file contains valid main path',
        expect: true,
        test: async () => {
            const packageJson = JSON.parse((await readFile(packageJsonPath)).toString());

            const mainPath = packageJson.main;

            return existsSync(mainPath);
        },
    });
});
