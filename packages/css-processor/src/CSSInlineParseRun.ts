import { getPropertyName } from 'css-to-react-native';
import { CSSParseRun } from './CSSParseRun';
import { MixedStyleDeclaration } from './CSSProcessor';
import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import { ValidatorsType } from './makepropertiesValidators';
import { CSSProperties } from './processor-types';
import { ShortMergeRequest } from './ShortMergeRequest';
import { GenericCSSPropertyValidator } from './validators/GenericPropertyValidator';
import { LongCSSPropertyValidator } from './validators/LongCSSPropertyValidator';

type CSSRawPropertiesList = [string, any][];

/**
 * The `!important` flag is stripped and ignored. Between style sources, this
 * makes no difference: inline styles are merged last, and tagsStyles,
 * classesStyles and idsStyles are JS objects which can't carry the flag.
 * Within one style attribute however, declarations are applied in order, so
 * a later declaration overrides an earlier important one, unlike in
 * browsers: `color: red !important; color: blue` gives blue.
 */
const IMPORTANT_FLAG_REGEX = /\s*!\s*important\s*$/i;

export class CSSInlineParseRun extends CSSParseRun {
  private rules: CSSRawPropertiesList;

  constructor(inlineCSS: string, registry: CSSPropertiesValidationRegistry) {
    super(registry);
    this.rules = this.parseInlineCSS(inlineCSS);
    this.normalizeProp = this.normalizeProp.bind(this);
    this.reduceProps = this.reduceProps.bind(this);
  }

  private parseInlineCSS(inlineCSS: string): CSSRawPropertiesList {
    return inlineCSS
      .split(';')
      .map((prop) => prop.split(':'))
      .reduce<CSSRawPropertiesList>((acc, prop) => {
        if (prop.length === 2) {
          return [
            ...acc,
            [prop[0].trim(), prop[1].replace(IMPORTANT_FLAG_REGEX, '').trim()]
          ];
        }
        return acc;
      }, []);
  }

  /**
   * Find the registered property matching a raw inline CSS property name.
   *
   * @remarks CSS property names are ASCII case-insensitive (e.g. `COLOR`).
   * Names registered as written are kept, which preserves support for
   * camelCase names (e.g. `paddingBottom`), others get a second attempt
   * lowercased.
   */
  private resolvePropertyName(rawName: string): keyof ValidatorsType | null {
    const camelCaseName = getPropertyName(rawName);
    if (this.validationMap.shouldRegisterInlineProperty(camelCaseName)) {
      return camelCaseName;
    }
    const lowercasedName = rawName.toLowerCase();
    if (lowercasedName !== rawName) {
      const lowercasedCamelCaseName = getPropertyName(lowercasedName);
      if (
        this.validationMap.shouldRegisterInlineProperty(lowercasedCamelCaseName)
      ) {
        return lowercasedCamelCaseName;
      }
    }
    return null;
  }

  /**
   * Normalize the lowercased form of a raw inline CSS value, or return null
   * when lowercasing leaves it unchanged, since it already failed as written.
   *
   * @remarks Values can be non-strings when expanded from a shorthand.
   */
  private normalizeLowercasedValue(
    validator: GenericCSSPropertyValidator,
    rawValue: unknown
  ) {
    if (typeof rawValue !== 'string') {
      return null;
    }
    const lowercasedValue = validator.lowercaseInlineCSSValue(rawValue);
    return lowercasedValue === rawValue
      ? null
      : validator.normalizeInlineCSSValue(lowercasedValue);
  }

  normalizeProp(
    rule: CSSRawPropertiesList[number],
    strict = false
  ): null | [keyof ValidatorsType, any] {
    const rawName = rule[0];
    const rawValue = rule[1];
    const camelCaseName = this.resolvePropertyName(rawName);
    if (camelCaseName === null) {
      return null;
    }
    const validator = this.validationMap.getValidatorForProperty(camelCaseName);
    // CSS keywords and units are case-insensitive. Values valid as written
    // are kept unchanged, others get a second attempt lowercased.
    const normalizedValue =
      validator.normalizeInlineCSSValue(rawValue) ??
      this.normalizeLowercasedValue(validator, rawValue);
    if (normalizedValue === null) {
      if (strict) {
        throw new TypeError();
      }
      return null;
    }
    return [camelCaseName, normalizedValue];
  }

  reduceProps(
    reg: CSSProperties,
    rule: null | [keyof ValidatorsType, Exclude<any, null>]
  ): CSSProperties {
    if (!rule) {
      return reg;
    }
    const [camelCaseName, normalizedValue] = rule;
    if (normalizedValue instanceof ShortMergeRequest) {
      try {
        return normalizedValue
          .map((r) => this.normalizeProp(r, true))
          .reduce(this.reduceProps, reg);
      } catch {
        return reg;
      }
    }
    return {
      ...reg,
      [camelCaseName]: normalizedValue
    };
  }

  fillProcessedProps() {
    const rawTransformed = this.rules
      .map((r) => this.normalizeProp(r))
      .reduce(this.reduceProps, {});
    (Object.keys(rawTransformed) as Array<keyof ValidatorsType>).forEach(
      (camelCaseName) => {
        const value = rawTransformed[camelCaseName];
        const validator = this.validationMap.getValidatorForProperty(
          camelCaseName
        ) as LongCSSPropertyValidator;
        const normalizedValue = validator.normalizeInlineCSSValue(value);
        this.processedProps.withProperty(
          camelCaseName as keyof MixedStyleDeclaration,
          normalizedValue,
          validator
        );
      }
    );
  }
}
