import React from 'react';
import { DimensionValue, View } from 'react-native';
import { useColorRoles } from '../theme/colorSystem';
import { PropsWithStyle } from './nucleons/types';

export default function BodyDividerAtom({
  color,
  height = 1,
  width = '100%'
}: PropsWithStyle<{
  color?: string;
  height?: number;
  width?: DimensionValue;
}>) {
  const { softDivider } = useColorRoles();
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: color ?? softDivider
      }}
    />
  );
}
