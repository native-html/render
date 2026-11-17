import colorKeywords from 'css-color-keywords';
import { LongForgivingCSSPropertyValidator } from './LongForgivingCSSPropertyValidator';
import { CSSPropertyModel } from './types';

const HEX_COLOR_REGEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const FUNCTIONAL_COLOR_REGEX = /^(?:rgb|rgba|hsl|hsla)\([\d,%. ]+\)$/;

const NAMED_COLORS = new Set([
  ...Object.keys(colorKeywords),
  // Supported by React Native, missing from css-color-keywords
  'transparent',
  'cyan',
  'magenta'
]);

export class LongColorCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongForgivingCSSPropertyValidator<C> {
  normalizeRawInlineCSSValue(value: string): string | null {
    if (
      NAMED_COLORS.has(value) ||
      HEX_COLOR_REGEX.test(value) ||
      FUNCTIONAL_COLOR_REGEX.test(value)
    ) {
      return value;
    }
    return null;
  }
}
