#! /usr/bin/env node
import * as child_process from 'node:child_process';
import yargs from 'yargs';
import { confirm } from '@inquirer/prompts';

/**
 * Returns true if the version is not a pre-release version, like 3.0.2-rc.1
 * @param {string} version
 * @return {boolean}
 */
function isNotPreRelease(version) {
  return !version.includes('-');
}

/**
 * Installs a specific version of a package using npm
 * @param {string} version
 */
function installVersion(version) {
  // TODO: add option to use another package manager?
  child_process.execSync(`npm install ${pkg}@${version}`);
}

const { good, bad, package: pkg } = yargs(process.argv.slice(2)).parse();

const versions = JSON.parse(
  child_process.execSync(`npm view ${pkg} versions --json`),
);

const goodIndex = versions.indexOf(good);
const badIndex = versions.indexOf(bad);
const versionsBetween = versions
  // TODO: this assumes that versions are sorted
  .slice(goodIndex + 1, badIndex)
  // TODO: add option to include pre-release versions?
  .filter(isNotPreRelease);

// TODO: implement bisecting algorithm to find the first bad version
for (const version of versionsBetween) {
  installVersion(version);
  const answer = await confirm({
    message: `Installed version ${version}. Good?`,
  });

  if (answer === false) {
    console.info('\x1b[1m%s\x1b[0m', version, 'is the first bad version.');
    break;
  }
}
