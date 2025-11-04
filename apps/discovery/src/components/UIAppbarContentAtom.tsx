import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, AppbarContentProps } from 'react-native-paper';
import { useColorRoles } from '../theme/colorSystem';
import useTextRoleNucleon from './nucleons/useTextRoleNucleon';

export type UIAppbarContentAtomProps = Omit<
  AppbarContentProps,
  'title' | 'titleStyle' | 'color'
> & {
  title?: string;
};

const styles = StyleSheet.create({
  title: {
    letterSpacing: 1.5
  }
});

export default function UIAppbarContentAtom({
  title,
  ...props
}: UIAppbarContentAtomProps) {
  const { surface } = useColorRoles();
  const titleStyle = useTextRoleNucleon({
    role: 'headerTitle',
    color: surface.content
  });

  const titleProps = title
    ? { title, titleStyle: [titleStyle, styles.title] }
    : { title: undefined };

  return <Appbar.Content {...props} {...titleProps} color={surface.content} />;
}
