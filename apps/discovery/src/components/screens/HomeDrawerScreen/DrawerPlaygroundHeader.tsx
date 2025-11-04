import { DrawerHeaderProps } from '@react-navigation/drawer';
import React from 'react';
import UIAppbarActionAtom from '../../UIAppbarActionAtom';
import UIAppbarContentAtom from '../../UIAppbarContentAtom';
import UIHeaderAtom from '../../UIHeaderAtom';

export type StandardHeaderOrganismProps = DrawerHeaderProps;

export default function DrawerPlaygroundHeader({
  options,
  navigation
}: StandardHeaderOrganismProps) {
  const onMenuPress = React.useCallback(
    () => (navigation as any).openDrawer(),
    [navigation]
  );
  return (
    <UIHeaderAtom>
      <UIAppbarActionAtom icon="menu" onPress={onMenuPress} />
      <UIAppbarContentAtom title={options.title} />
    </UIHeaderAtom>
  );
}
