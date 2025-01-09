import {join, resolve} from 'node:path';

const repoDirPath = resolve(import.meta.dirname, '..', '..');
export const testFilesDirPath = join(repoDirPath, 'src', 'test', 'tests');
