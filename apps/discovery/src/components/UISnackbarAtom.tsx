import React, { ComponentProps } from 'react';
import { Falsy } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { TextRole } from './nucleons/useTextRoleNucleon';
import { useColorPrimitives } from '../theme/colorSystem';
import TextRoleNucleon, {
  TextRoleNucleonProps
} from './nucleons/TextRoleNucleon';

export interface UISnackbarAtomProps
  extends Omit<ComponentProps<typeof Snackbar>, 'style' | 'children' | 'role'> {
  children?: string | Falsy;
  textProps?: TextRoleNucleonProps;
  role?: TextRole;
}

export default function UISnackbarAtom({
  children,
  textProps,
  role = 'uiLabel',
  ...props
}: UISnackbarAtomProps) {
  const { surface } = useColorPrimitives();
  return (
    <Snackbar style={{ backgroundColor: surface.content }} {...props}>
      <TextRoleNucleon role={role} color={surface.color} {...textProps}>
        {children}
      </TextRoleNucleon>
    </Snackbar>
  );
}
