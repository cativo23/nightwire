import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';

export const ENGINES = ['chrome', 'firefox'];

/** Parse `--engine chrome|firefox|all` and `--out <dir>`. Throws Error with a usage message. */
export function parseBrowserArgs(argv) {
  const { values } = parseArgs({
    args: argv,
    options: { engine: { type: 'string', default: 'all' }, out: { type: 'string' } },
  });
  if (values.engine !== 'all' && !ENGINES.includes(values.engine)) {
    throw new Error(`--engine must be chrome|firefox|all, got "${values.engine}"`);
  }
  return {
    engines: values.engine === 'all' ? [...ENGINES] : [values.engine],
    out: path.resolve(values.out ?? path.join(os.tmpdir(), 'nightwire-browsers')),
  };
}
