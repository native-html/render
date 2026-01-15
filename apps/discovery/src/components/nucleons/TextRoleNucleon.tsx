import * as React from 'react';
import { Text as NativeText } from 'react-native';
import { TextProps } from 'react-native';
import useTextRoleNucleon, {
  TextRoleNucleonProps as T
} from './useTextRoleNucleon';

export type TextRoleNucleonProps = Omit<TextProps, 'role'> & T;

export default function TextRoleNucleon({
  style,
  align,
  color,
  role,
  ...props
}: TextRoleNucleonProps) {
  const generatedStyle = useTextRoleNucleon({ role, align, color });
  return (
    <NativeText
      {...props}
      textBreakStrategy="simple"
      style={[generatedStyle, style]}
    />
  );
}
