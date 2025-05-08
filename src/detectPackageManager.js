import * as fs from 'node:fs';
import * as path from 'node:path';

export const packageManagerConfig = {
  npm: {
    lockFile: 'package-lock.json',
    installCommand: 'npm install',
  },
  yarn: {
    lockFile: 'yarn.lock',
    installCommand: 'yarn add',
  },
};

export function detectPackageManager() {
  for (const [pm, { lockFile: file }] of Object.entries(packageManagerConfig)) {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      return pm;
    }
  }

  return 'npm';
}
