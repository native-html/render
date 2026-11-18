import { ShortCSSToReactNativeValidator } from './ShortCSSToReactNativeValidator';
import normalizeFontName from './normalizeFontName';
import { CSSPropertyModel } from './types';
import { ShortMergeRequest } from '../ShortMergeRequest';
import { lowercaseCSSKeywords } from '../helpers';

const WHITESPACE_REGEX = /\s+/;

const WHITESPACE_SEPARATOR_REGEX = /(\s+)/;

/**
 * A font size with a unit, optionally followed by a line height, such as
 * `12px` or `12px/1.5`.
 */
const FONT_SIZE_REGEX = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[a-z]+|%)(?:\/\S*)?$/i;

export class ShortFontCSSValidator<
  C extends CSSPropertyModel
> extends ShortCSSToReactNativeValidator<C> {
  /**
   * Only lowercase the keywords preceding the font family, which is matched
   * by exact name against the available fonts. In the font shorthand, the
   * font family always follows the font size.
   */
  lowercaseInlineCSSKeywords(value: string): string {
    const chunks = value.split(WHITESPACE_SEPARATOR_REGEX);
    const sizeIndex = chunks.findIndex((chunk) => FONT_SIZE_REGEX.test(chunk));
    if (sizeIndex === -1) {
      return value;
    }
    return (
      lowercaseCSSKeywords(chunks.slice(0, sizeIndex + 1).join('')) +
      chunks.slice(sizeIndex + 1).join('')
    );
  }

  normalizeInlineCSSValue(value: string): ShortMergeRequest | null {
    // A 'font' declaration may end with a list of multiple font families.
    // We must check support for this list before processing.
    const resp = value.split(',');
    let fontFamily = null;
    if (resp.length === 1) {
      return super.normalizeInlineCSSValue(resp[0]);
    }
    const base = resp.splice(0, 1)[0];
    for (const font of resp) {
      const normalizedFont = normalizeFontName(font);
      const isFontSupported = this.config.isFontSupported(normalizedFont);
      if (isFontSupported) {
        fontFamily =
          typeof isFontSupported === 'string'
            ? isFontSupported
            : normalizedFont;
        break;
      }
    }
    return super.normalizeInlineCSSValue(
      base.split(WHITESPACE_REGEX).slice(0, -1).join(' ') +
        ' ' +
        (fontFamily || 'system')
    );
  }
}
