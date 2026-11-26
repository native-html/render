import { ShortCSSPropertyValidator } from './ShortCSSPropertyValidator';
import { CSSPropertyModel } from './types';
import expandCSSToRN from './expandCSSToRN';
import { ShortMergeRequest } from '../ShortMergeRequest';
import { lowercaseCSSValue } from '../helpers';

export class ShortCSSToReactNativeValidator<
  C extends CSSPropertyModel = any
> extends ShortCSSPropertyValidator<C> {
  normalizeInlineCSSValue(value: string): ShortMergeRequest | null {
    const expanded = expandCSSToRN(this.propertyName, value);
    return expanded ? new ShortMergeRequest(expanded) : null;
  }
  /**
   * Not supported on Native.
   * @param value
   */
  normalizeNativeValue() {
    return null;
  }

  lowercaseInlineCSSValue(value: string): string {
    return lowercaseCSSValue(value);
  }
}
