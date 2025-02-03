export function objectIsEqual(
  a: { [key: string]: string[] },
  b: { [key: string]: string[] },
): boolean {
  const writeKeys = Object.keys(a);
  const readKeys = Object.keys(b);
  return writeKeys.length !== readKeys.length
    ? false
    : writeKeys.every((k) => {
        if (readKeys.includes(k)) {
          if (b[k].length !== a[k].length) {
            return false;
          }
          return a[k].every((v) => b[k].includes(v));
        }
        return false;
      });
}
