import {dirname, join} from 'path';

const repoPath = dirname(__dirname);
// directly run js files to avoid extra listeners getting attached from ts-node
export const testFileDir = join(repoPath, 'dist', 'test', 'files');
