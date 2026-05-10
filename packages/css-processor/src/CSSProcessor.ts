import { CSSProcessorConfig } from './config';
import { CSSInlineParseRun } from './CSSInlineParseRun';
import { CSSNativeParseRun } from './CSSNativeParseRun';
import { CSSProcessedProps } from './CSSProcessedProps';
import { CSSPropertiesValidationRegistry } from './CSSPropertiesValidationRegistry';
import { defaultCSSProcessorConfig } from './default';
import {
  ExtraNativeShortStyle,
  ExtraNativeTextStyle,
  ExtraNativeUntranslatedLongStyles,
  ExtraNativeViewStyle
} from './native-types';
import {
  WebBlockRetainProperties,
  WebTextFlowProperties
} from './processor-types';

// https://www.w3.org/TR/CSS22/
// https://www.w3.org/TR/css3-cascade/
// https://www.w3.org/TR/css-cascade-4/
// https://www.w3.org/TR/css-text-3/
// https://www.w3.org/TR/css3-values/
// https://www.w3.org/TR/css-values-4/

/**
 * All those styles that result from processing inline styles.
 */
export type CSSFlattenProcessedTypes =
  CSSProcessedProps['native']['text']['flow'] &
    CSSProcessedProps['native']['block']['flow'] &
    CSSProcessedProps['native']['text']['retain'] &
    CSSProcessedProps['native']['block']['retain'];

/**
 * These properties can be set to any of the supoprted CSS sizes, including em,
 * rem units and special values such as large, larger for `fontSize`, thin,
 * medium for `borderWidth`, before passed to {@link CSSProcessor.compileStyleDeclaration}.
 */
export type MixedSizeCSSPropertiesKeys =
  | 'fontSize'
  | 'borderWidth'
  | 'letterSpacing'
  | 'bottom'
  | 'left'
  | 'top'
  | 'right'
  | 'width'
  | 'height'
  | 'flexBasis'
  | 'borderRadius'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderWidth'
  | 'borderBottomWidth'
  | 'borderLeftWidth'
  | 'borderRightWidth'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'marginTop'
  | 'margin'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'maxWidth'
  | 'maxHeight'
  | 'minWidth'
  | 'minHeight'
  | 'padding'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingTop'
  | 'paddingHorizontal'
  | 'paddingVertical';

/**
 * A Style object that can contain mixins of a subset of ViewStyle, TextStyle,
 * and special style entries such as "whiteSpace", "listStyleType".
 *
 * @remarks Also note that special lengths,
 * such as "em", "rem" units, and special values, such as "%" for fontSize, and
 * keyword values ('larger', 'smaller' for fontSize, 'thick', 'thin', 'medium'
 * for border*Width) will be handled as per CSS specifications on units.
 * Another special use case is fontFamily, which can be a list of font names as
 * per the CSS standard. The translated font will be selected with
 * {@link CSSProcessorConfig.isFontSupported}.
 */
export type MixedStyleDeclaration = Omit<
  CSSFlattenProcessedTypes,
  MixedSizeCSSPropertiesKeys
> &
  WebTextFlowProperties &
  WebBlockRetainProperties &
  ExtraNativeTextStyle &
  ExtraNativeViewStyle &
  ExtraNativeShortStyle &
  ExtraNativeUntranslatedLongStyles & {
    [k in MixedSizeCSSPropertiesKeys]?: number | string;
  };

// Bounded to avoid unbounded growth on long-lived processors.
const INLINE_CSS_CACHE_LIMIT = 256;

export class CSSProcessor {
  public readonly registry: CSSPropertiesValidationRegistry;
  // LRU cache: same inline string compiles to the same CSSProcessedProps.
  private inlineCssCache: Map<string, CSSProcessedProps> = new Map();
  constructor(userConfig?: Partial<CSSProcessorConfig>) {
    const config = {
      ...defaultCSSProcessorConfig,
      ...userConfig
    };
    this.registry = new CSSPropertiesValidationRegistry(config);
  }

  /**
   *
   * Incoming style declaration:
   * - For native styles: any RN compatible style declaration + special units
   *   (font-size: medium) + relative units (smaller, larger, em, rem and perhaps vw)
   *
   * @param declaration
   */
  compileStyleDeclaration(
    declaration: MixedStyleDeclaration
  ): CSSProcessedProps {
    const parseRun = new CSSNativeParseRun(declaration, this.registry);
    return parseRun.exec();
  }

  compileInlineCSS(inlineCSS: string): CSSProcessedProps {
    const cache = this.inlineCssCache;
    const cached = cache.get(inlineCSS);
    if (cached !== undefined) {
      // LRU touch: re-insert to mark as most recently used.
      cache.delete(inlineCSS);
      cache.set(inlineCSS, cached);
      return cached;
    }
    const parseRun = new CSSInlineParseRun(inlineCSS, this.registry);
    const result = parseRun.exec();
    if (cache.size >= INLINE_CSS_CACHE_LIMIT) {
      // Evict oldest (Map preserves insertion order).
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) {
        cache.delete(oldest);
      }
    }
    cache.set(inlineCSS, result);
    return result;
  }
}
