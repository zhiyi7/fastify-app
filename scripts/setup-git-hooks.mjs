import { execFileSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    encoding: 'utf8',
}).trim();

const hooksPath = path.join(repoRoot, '.githooks');

execFileSync('git', ['config', 'core.hooksPath', hooksPath], {
    stdio: 'inherit',
});

console.log(`Git hooks are now enabled from ${hooksPath}`);
