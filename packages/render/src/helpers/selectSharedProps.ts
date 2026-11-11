import mergeRight from 'ramda/src/mergeRight';
import pick from 'ramda/src/pick';
import pickBy from 'ramda/src/pickBy';
import pipe from 'ramda/src/pipe';
import { RenderHTMLProps, RenderHTMLAmbiantSharedProps } from '../shared-types';
import defaultSharedProps from '../context/defaultSharedProps';

const selectSharedProps: (
  props: Partial<RenderHTMLProps>
) => RenderHTMLAmbiantSharedProps = pipe(
  // @ts-ignore TODO fix this
  pick(Object.keys(defaultSharedProps)),
  pickBy((val) => val != null),
  mergeRight(defaultSharedProps) as any
);

export default selectSharedProps;
