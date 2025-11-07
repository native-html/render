// TEMPORARY: Commented out for benchmarking app compatibility
// import CounterStyle from '@jsamr/counter-style';
// import decimal from '@jsamr/counter-style/presets/decimal';
// import decimalLeadingZero from '@jsamr/counter-style/presets/decimalLeadingZero';
// import lowerRoman from '@jsamr/counter-style/presets/lowerRoman';
// import lowerAlpha from '@jsamr/counter-style/presets/lowerAlpha';
// import lowerGreek from '@jsamr/counter-style/presets/lowerGreek';
// import upperAlpha from '@jsamr/counter-style/presets/upperAlpha';
// import upperRoman from '@jsamr/counter-style/presets/upperRoman';
import DisclosureClosedSymbolRenderer from './symbolic/DisclosureClosedSymbolRenderer';
import DisclosureOpenSymbolRenderer from './symbolic/DisclosureOpenSymbolRenderer';
import CircleSymbolRenderer from './symbolic/CircleSymbolRenderer';
import DiscSymbolRenderer from './symbolic/DiscSymbolRenderer';
import SquareSymbolRenderer from './symbolic/SquareSymbolRenderer';
import type {
  DefaultSupportedListStyleType,
  ListStyleSpec
} from '../shared-types';

// TEMPORARY: Simple stub renderer
const stubRenderer = {
  renderCounter: (index: number) => `${index}`,
  renderPrefix: () => '',
  renderSuffix: () => '. ',
  withSuffix: (suffix: string | null) => stubRenderer,
  format: (index: number) => `${index}.`
} as any;

const unitaryRenderer = stubRenderer; // CounterStyle.cyclic('*').withSuffix(' ');

const lowerAlphaSpec = {
  type: 'textual',
  counterStyleRenderer: stubRenderer // lowerAlpha
} as const;

const upperAlphaSpec = {
  type: 'textual',
  counterStyleRenderer: stubRenderer // upperAlpha
} as const;

/**
 * Default list style specs supported by this library.
 *
 * @public
 */
const defaultListStyleSpecs: Record<
  DefaultSupportedListStyleType,
  ListStyleSpec
> = {
  'decimal-leading-zero': {
    type: 'textual',
    counterStyleRenderer: stubRenderer // decimalLeadingZero
  },
  'disclosure-closed': {
    counterStyleRenderer: unitaryRenderer,
    type: 'unitary',
    Component: DisclosureClosedSymbolRenderer
  },
  'disclosure-open': {
    counterStyleRenderer: unitaryRenderer,
    type: 'unitary',
    Component: DisclosureOpenSymbolRenderer
  },
  'lower-alpha': lowerAlphaSpec,
  'lower-greek': {
    type: 'textual',
    counterStyleRenderer: stubRenderer // lowerGreek
  },
  'lower-latin': lowerAlphaSpec,
  'lower-roman': {
    type: 'textual',
    counterStyleRenderer: stubRenderer // lowerRoman
  },
  'upper-alpha': upperAlphaSpec,
  'upper-latin': upperAlphaSpec,
  'upper-roman': {
    type: 'textual',
    counterStyleRenderer: stubRenderer // upperRoman
  },
  circle: {
    counterStyleRenderer: unitaryRenderer,
    type: 'unitary',
    Component: CircleSymbolRenderer
  },
  decimal: {
    type: 'textual',
    counterStyleRenderer: stubRenderer // decimal
  },
  disc: {
    counterStyleRenderer: unitaryRenderer,
    type: 'unitary',
    Component: DiscSymbolRenderer
  },
  none: {
    counterStyleRenderer: stubRenderer, // CounterStyle.symbolic('').withSuffix(null),
    type: 'unitary',
    Component: () => null
  },
  square: {
    counterStyleRenderer: unitaryRenderer,
    type: 'unitary',
    Component: SquareSymbolRenderer
  }
};

export default defaultListStyleSpecs;
