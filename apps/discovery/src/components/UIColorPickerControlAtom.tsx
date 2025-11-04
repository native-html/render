import React, { useCallback } from 'react';
import ColorPicker, {
  ColorPickerProps,
  HueSlider,
  Preview
} from 'reanimated-color-picker';
import { SelectorProps, PropsWithStyle } from './nucleons/types';

export type UIColorPickerControlAtomProps = Pick<
  SelectorProps<string>,
  'onSelectedValueChange'
> &
  PropsWithStyle<{
    initialValue: string;
  }>;

export default function UIColorPickerControlAtom({
  onSelectedValueChange,
  initialValue,
  style
}: UIColorPickerControlAtomProps) {
  const onSelectColor = useCallback<
    NonNullable<ColorPickerProps['onComplete']>
  >(
    ({ hex }) => {
      'worklet';
      onSelectedValueChange(hex);
    },
    [onSelectedValueChange]
  );

  return (
    <ColorPicker value={initialValue} onComplete={onSelectColor} style={style}>
      <Preview />
      <HueSlider />
    </ColorPicker>
  );
}
