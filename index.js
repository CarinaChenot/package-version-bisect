#! /usr/bin/env node
import * as child_process from 'node:child_process';
import yargs from 'yargs';
import confirm from '@inquirer/confirm';
import semverSort from 'semver/functions/sort.js';
import { findBadVersion } from './src/findBadVersion.js';

/**
 * Returns versions of a package between two versions
 * @param {string} pkg
 * @param {string} startVersion
 * @param {string} endVersion
 * @return {string[]}
 */
function getVersions(pkg, startVersion, endVersion) {
  let versions = JSON.parse(
    child_process.execSync(`npm view ${pkg} versions --json`),
  ).filter(isNotPreRelease);

  versions = semverSort(versions);

  const goodIndex = versions.indexOf(startVersion);
  const badIndex = versions.indexOf(endVersion);

  return versions.slice(goodIndex + 1, badIndex);
}

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
