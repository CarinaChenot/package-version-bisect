#! /usr/bin/env node
import * as child_process from 'node:child_process';
import yargs from 'yargs';
import confirm from '@inquirer/confirm';
import { findBadVersion } from './src/findBadVersion.js';
import { getVersions } from './src/getVersions.js';

/**
 * Installs a specific version of a package using npm
 * @param {string} pkg
 * @param {string} version
 * @param {string} installCommand - command to use when installing the package
 */
function installVersion(pkg, version, installCommand = 'npm install') {
  child_process.execSync(`${installCommand} ${pkg}@${version}`);
}

function ask(version) {
  return confirm({
    message: `Installed version ${version}. Good?`,
  });
}

const {
  good,
  bad,
  package: pkg,
  install: installCommand,
} = yargs(process.argv.slice(2)).parse();

const versionsToCheck = getVersions(pkg, good, bad);

const culpritVersion = await findBadVersion(
  versionsToCheck,
  (version) => installVersion(pkg, version, installCommand),
  ask,
);

console.info('\x1b[1m%s\x1b[0m', culpritVersion, 'is the first bad version.');
