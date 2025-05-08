/**
 * Performs a binary search to find the first bad version, based on user input.
 * @param {string[]} versions - The list of sorted versions.
 * @param {Function} installVersion - Function to install a specific version.
 * @param {Function} prompt - Function to prompt user feedback.
 * @returns {Promise<string>} The first bad version.
 */
export async function findBadVersion(versions, installVersion, prompt) {
  if (!versions.length) {
    throw new Error('Empty versions list');
  }

  let start = 0;
  let end = versions.length - 1;

  while (start !== end) {
    const mid = Math.floor((start + end) / 2);
    const midVersion = versions[mid];

    installVersion(midVersion);

    if (await prompt(midVersion)) {
      start = mid + 1;
    } else {
      end = mid;
    }
  }

  return versions[start];
}
