const VERSION_FORMAT = /^(\~|\^)?\d*\.\d*\.\d*$/;

/**
 * Returns latest version from all
 * @example
 * ```javascript
 * getLatestVersion('^2.0.0', '^1.0.0') // '^2.0.0'
 * getLatestVersion('^2.0.0', '~1.0.0') // '~1.0.0'
 * getLatestVersion('latest', '^2.0.0') // 'latest'
 * getLatestVersion('latest', '~1.0.0') // '~1.0.0'
 * getLatestVersion('latest', 'next') // 'next'
 * getLatestVersion() // 'latest'
 * ```
 */
export function getLatestVersion(...versions: string[]) {
  const latestVersion = versions.filter(Boolean)
    .map(convertVersions(padZeroes))
    .sort()
    .map(convertVersions(trimZeroes))
    .pop();

  return latestVersion || 'latest';
}

function convertVersions(converter: (version: string) => string) {
  return (version: string) => {
    if (!isStandardVersion(version)) return version;
    return version.match(/^(\~|\^)/)
      ? version.slice(0, 1) + converter(version.slice(1))
      : converter(version);
  };
}

/**
 * Inserts `0` into start of versions
 * @example
 * // 2.10.0 -> 002.010.000
 */
function padZeroes(version: string): string {
  return version.split('.')
    .map((subV) => subV.padStart(3, '0'))
    .join('.');
}

/**
 * Removes `0` from start of versions
 * @example
 * // 002.010.000 -> 2.10.0
 */
function trimZeroes(version: string): string {
  return version.split('.')
    .map((subV) => subV.replace(/^0*/, '') || '0')
    .join('.');
}

function isStandardVersion(version: string): boolean {
  return Boolean(version.match(VERSION_FORMAT));
}
