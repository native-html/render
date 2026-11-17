import { LongSizeCSSPropertyValidator } from './LongSizeCSSPropertyValidator';
import { CSSPropertyModel } from './types';

/**
 * A validator for size properties accepting negative lengths, such as
 * margins, offsets (top, right, bottom, left) and letter-spacing.
 */
export class LongSignedSizeCSSPropertyValidator<
  C extends CSSPropertyModel
> extends LongSizeCSSPropertyValidator<C> {
  protected allowsNegativeValues(): boolean {
    return true;
  }
}
