const HEX_COLOR_TOKEN_REGEX = /(#[0-9a-f]+)/i;

/**
 * Lowercase a CSS value, preserving the case of hex colors.
 *
 * @param value - The CSS value to lowercase.
 */
export function lowercaseCSSValue(value: string): string {
  return (
    value
      .split(HEX_COLOR_TOKEN_REGEX)
      // Captured hex colors are at odd indexes.
      .map((chunk, i) => (i % 2 === 1 ? chunk : chunk.toLowerCase()))
      .join('')
  );
}

export function lookupRecord<T extends Record<string, any>>(
  record: T,
  key: any
): key is keyof T {
  const value = record[key];
  return !!value;
}
