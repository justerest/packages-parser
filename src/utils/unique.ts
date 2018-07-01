/**
 * Filters unique values
 * @example
 * array.filter(unique());
 */
export function unique() {
  const incluededValues = new Set();
  return (el: any) => {
    if (incluededValues.has(el)) return false;
    else {
      incluededValues.add(el);
      return true;
    }
  };
}
