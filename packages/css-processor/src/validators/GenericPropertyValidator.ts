import { CSSProcessorConfig } from '../config';
import { CSSPropertyModel, CSSPropertyValidatorParams } from './types';
import {
  CSSPropertyCompatCategory,
  CSSPropertyDisplayCategory,
  CSSPropertyPropagationCategory,
  CSSPropertySpecs
} from '../processor-types';
import { ShortMergeRequest } from '../ShortMergeRequest';

export abstract class GenericCSSPropertyValidator<
  C extends CSSPropertyModel = any,
  N = any
> implements CSSPropertySpecs
{
  protected readonly model: C;
  protected readonly config: CSSProcessorConfig;
  public readonly compatCategory: CSSPropertyCompatCategory;
  public readonly propagationCategory: CSSPropertyPropagationCategory;
  public readonly displayCategory: CSSPropertyDisplayCategory;
  public readonly propertyName: string;
  private readonly _isShorthand: boolean;

  constructor(
    { model, config, propertyName }: CSSPropertyValidatorParams<C>,
    isShorthand: boolean
  ) {
    this.model = model;
    this.config = config;
    this.compatCategory = model.translatable ? 'native' : 'web';
    this.propagationCategory = model.inheritable ? 'flow' : 'retain';
    this.displayCategory = model.display;
    this.propertyName = propertyName;
    this._isShorthand = isShorthand;
  }

  /**
   * Normalize value from inline styles
   *
   * @param value
   */
  abstract normalizeInlineCSSValue(
    value: string | N
  ): ShortMergeRequest | N | null;

  /**
   * Normalize value from native styles.
   *
   * @param value
   */
  abstract normalizeNativeValue(value: N): ShortMergeRequest | N | null;

  /**
   * Lowercase the case-insensitive parts of an inline CSS value which failed
   * normalization as written, for a second normalization attempt. CSS
   * keywords and units are ASCII case-insensitive (e.g. `display: FLEX`,
   * `width: 10PX`), while React Native style values are not, so this is only
   * used for inline CSS.
   *
   * @remarks The default implementation returns the value unchanged, which
   * prevents a second attempt. Validators must not override it when
   * lowercasing would change what a value refers to: font families are
   * matched by exact name against the available fonts, list style types may
   * name user-defined `customListStyleSpecs` entries, and transforms are
   * parsed by css-to-react-native, which expects camelCase function names
   * such as `translateX`.
   *
   * @param value - The inline CSS value which failed normalization.
   */
  lowercaseInlineCSSValue(value: string): string {
    return value;
  }

  isShorthand(): boolean {
    return this._isShorthand;
  }
}
