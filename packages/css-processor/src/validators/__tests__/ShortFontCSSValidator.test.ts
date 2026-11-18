import { ShortMergeRequest } from '../../ShortMergeRequest';
import { registryFromConfig } from './helpers';

describe('ShortFontCSSValidator', () => {
  describe('normalizeInlineCSSValue method', () => {
    it('should return the font mapped by config.isFontSupported when it returns string', () => {
      const registry = registryFromConfig({
        isFontSupported() {
          return 'GreatFont';
        }
      });
      expect(
        registry.validators.font.normalizeInlineCSSValue(
          'italic small-caps bold 12px/30px Georgia, serif'
        )
      ).toStrictEqual(
        new ShortMergeRequest({
          fontFamily: 'GreatFont',
          fontStyle: 'italic',
          fontVariant: ['small-caps'],
          fontWeight: 'bold',
          fontSize: 12,
          lineHeight: 30
        })
      );
    });
    it('should return the first validated font identified by config.isFontSupported invalidate', () => {
      const registry = registryFromConfig({
        isFontSupported(fontName: string) {
          return fontName === 'serif';
        }
      });
      expect(
        registry.validators.font.normalizeInlineCSSValue(
          'italic small-caps bold 12px/30px Georgia, serif'
        )
      ).toStrictEqual(
        new ShortMergeRequest({
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontVariant: ['small-caps'],
          fontWeight: 'bold',
          fontSize: 12,
          lineHeight: 30
        })
      );
    });
    it('should return special "system" font when config.isFontSupported invalidate all font names', () => {
      const registry = registryFromConfig({
        isFontSupported() {
          return false;
        }
      });
      expect(
        registry.validators.font.normalizeInlineCSSValue(
          'italic small-caps bold 12px/30px Georgia, serif'
        )
      ).toStrictEqual(
        new ShortMergeRequest({
          fontFamily: 'system',
          fontStyle: 'italic',
          fontVariant: ['small-caps'],
          fontWeight: 'bold',
          fontSize: 12,
          lineHeight: 30
        })
      );
    });
  });
  describe('lowercaseInlineCSSKeywords method', () => {
    const validator = registryFromConfig({}).validators.font;
    it('should lowercase keywords up to and including the font size', () => {
      expect(
        validator.lowercaseInlineCSSKeywords('ITALIC BOLD 12PX/18PX Georgia')
      ).toBe('italic bold 12px/18px Georgia');
    });
    it('should return the value unchanged when it has no font size', () => {
      expect(validator.lowercaseInlineCSSKeywords('BOLD Georgia')).toBe(
        'BOLD Georgia'
      );
    });
  });
});
