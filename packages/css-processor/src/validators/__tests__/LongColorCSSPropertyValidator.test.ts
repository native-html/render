import { registryFromConfig } from './helpers';

describe('LongColorCSSPropertyValidator', () => {
  const registry = registryFromConfig({});
  const validator = registry.validators.color;
  describe('normalizeRawInlineCSSValue method', () => {
    it('should support CSS color functions', () => {
      expect(validator.normalizeRawInlineCSSValue('rgb(10,10,10)')).toBe(
        'rgb(10,10,10)'
      );
    });
    it('should support CSS color functions with argument containing spaces', () => {
      expect(validator.normalizeRawInlineCSSValue('rgb(10, 10, 10)')).toBe(
        'rgb(10, 10, 10)'
      );
      expect(validator.normalizeRawInlineCSSValue('rgb(10 , 10 , 10)')).toBe(
        'rgb(10 , 10 , 10)'
      );
    });
    it('should support hex colors', () => {
      expect(validator.normalizeRawInlineCSSValue('#121010')).toBe('#121010');
    });
    it('should support hex colors with 3, 4, 6 and 8 digits, preserving case', () => {
      for (const hex of ['#FFF', '#ffff', '#AbCdEf', '#abcdef80']) {
        expect(validator.normalizeRawInlineCSSValue(hex)).toBe(hex);
      }
    });
    it('should reject hex colors with an invalid length or invalid digits', () => {
      for (const hex of ['#', '#ff', '#fffff', '#fffffff', '#zzz', 'fff']) {
        expect(validator.normalizeRawInlineCSSValue(hex)).toBe(null);
      }
    });
    it('should support named colors', () => {
      expect(validator.normalizeRawInlineCSSValue('red')).toBe('red');
      expect(validator.normalizeRawInlineCSSValue('rebeccapurple')).toBe(
        'rebeccapurple'
      );
    });
    it('should support transparent, cyan and magenta', () => {
      for (const name of ['transparent', 'cyan', 'magenta']) {
        expect(validator.normalizeRawInlineCSSValue(name)).toBe(name);
      }
    });
    it('should reject color keywords unsupported by React Native', () => {
      for (const name of ['currentColor', 'currentcolor', 'inherit']) {
        expect(validator.normalizeRawInlineCSSValue(name)).toBe(null);
      }
    });
    it('should reject unknown color names', () => {
      expect(validator.normalizeRawInlineCSSValue('notacolor')).toBe(null);
    });
    it('should reject values with trailing or leading garbage', () => {
      for (const value of [
        'not a color',
        'red !important',
        'rgb(0, 0, 0) !important',
        'url(x.png) blue',
        'red blue',
        'rgb(0,0,0) red'
      ]) {
        expect(validator.normalizeRawInlineCSSValue(value)).toBe(null);
      }
    });
    it('should reject empty values', () => {
      expect(validator.normalizeRawInlineCSSValue(' ')).toBe(null);
    });
  });
});
