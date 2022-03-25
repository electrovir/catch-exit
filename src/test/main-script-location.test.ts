import {existsSync} from 'fs';
import {readFile} from 'fs/promises';

describe('package.json', () => {
    const packageJsonPath = 'package.json';

    it('package.json file contains valid main path', async () => {
        const packageJson = JSON.parse((await readFile(packageJsonPath)).toString());

        const mainPath = packageJson.main;
        expect(mainPath).toBeTruthy();
        expect(existsSync(mainPath)).toBe(true);
    });
});
