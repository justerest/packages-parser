export function getLatestVersion(...versions: string[]) {
  const latestVersion = versions
    .map((version) => {
      if (!version.match(/\./)) return version;

      // insert `0` into start of versions (2.10.0 -> 02.10.00)
      const firstSymbol = version.slice(0, 1);
      return firstSymbol + version.slice(1)
        .split('.')
        .map((subV) => subV.length < 2 ? '0' + subV : subV)
        .join('.');
    })
    .sort()
    .map((version) => {
      if (!version.match(/\./)) return version;

      // (02.10.00 -> 2.10.0)
      const firstSymbol = version.slice(0, 1);
      return firstSymbol + version.slice(1)
        .split('.')
        .map((subV) => subV.match(/^0/) ? subV.slice(1) : subV)
        .join('.');
    })
    .pop();

  return latestVersion || 'latest';
}
