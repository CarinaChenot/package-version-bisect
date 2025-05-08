import semverSort from 'semver/functions/sort.js';
import * as child_process from 'node:child_process';

/**
 * Returns true if the version is not a pre-release version, like 3.0.2-rc.1
 * @param {string} version
 * @return {boolean}
 */
function isNotPreRelease(version) {
  return !version.includes('-');
}

/**
 * Returns versions of a package between two versions
 * @param {string} pkg
 * @param {string} startVersion
 * @param {string} endVersion
 * @return {string[]}
 */
export function getVersions(
  pkg,
  startVersion,
  endVersion,
  exec = child_process.execSync,
) {
  let versions = JSON.parse(exec(`npm view ${pkg} versions --json`)).filter(
    isNotPreRelease,
  );

  versions = semverSort(versions);

  const goodIndex = versions.indexOf(startVersion);
  const badIndex = versions.indexOf(endVersion);

  return versions.slice(goodIndex + 1, badIndex);
}
