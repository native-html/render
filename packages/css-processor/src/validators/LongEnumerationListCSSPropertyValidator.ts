import { LongCSSPropertyValidator } from './LongCSSPropertyValidator';
import { CSSPropertyValidatorParams, CSSPropertyModel } from './types';

const WHITESPACE_REGEX = /\s+/;

export class LongEnumerationListCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongCSSPropertyValidator<C, string[]> {
  public readonly allowedList: ReadonlyArray<string>;
  constructor(params: CSSPropertyValidatorParams<C>, allowedList: string[]) {
    super(params);
    this.allowedList = allowedList;
  }

  /**
   * Items are matched case-insensitively, since CSS keywords are
   * case-insensitive. This doesn't affect React Native style values, which
   * are not normalized by this validator.
   */
  normalizeRawInlineCSSValue(value: string): string[] | null {
    const input = value.split(WHITESPACE_REGEX);
    const values: string[] = [];
    for (const item of input) {
      const lowercasedItem = item.toLowerCase();
      if (this.allowedList.indexOf(lowercasedItem) !== -1) {
        values.push(lowercasedItem);
      }
    }
    return values.length > 0 ? values : null;
  }
}
