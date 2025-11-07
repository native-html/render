// TEMPORARY: Commented out for benchmarking app compatibility
// import { getStylesForProperty } from 'css-to-react-native';

// TEMPORARY: Simple stub that returns null (skips shorthand expansion)
// In production, this would use css-to-react-native to expand shorthand properties
function getStylesForProperty(propertyName: string, value: string): any {
  // Return a simple object with the property - not a full expansion but sufficient for benchmarking
  const camelCaseName = propertyName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  return { [camelCaseName]: value };
}

export default function expandCSSToRN(propertyName: string, value: string) {
  try {
    return getStylesForProperty(propertyName, value);
  } catch {
    // Ignore this rule if parsing failed
  }
  return null;
}
