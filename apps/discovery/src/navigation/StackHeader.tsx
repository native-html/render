import { StackHeaderProps } from '@react-navigation/stack';
import React from 'react';
import UIAppbarActionAtom from '../components/UIAppbarActionAtom';
import UIAppbarContentAtom from '../components/UIAppbarContentAtom';
import UIHeaderAtom from '../components/UIHeaderAtom';

export { StackHeaderProps };

export default function StackHeader({
  options: { title },
  navigation: { goBack }
}: StackHeaderProps) {
  return (
    <UIHeaderAtom>
      <UIAppbarActionAtom icon="arrow-left" onPress={goBack} />
      <UIAppbarContentAtom title={title} />
    </UIHeaderAtom>
  );
}
