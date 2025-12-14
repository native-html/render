import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { TNode } from '@native-html/render';
import UIBottomSheetAtom from '../../UIBottomSheetAtom';
import BoxNucleon from '../../nucleons/BoxNucleon';
import { demoStateContext } from './contexts';
import { usePlaygroundSource } from './playgroundStore';
import SheetChildrenRenderer, { TpChildren } from './SheetChildrenRenderer';
import SheetNavigator from './SheetNavigator';
import sheetSnapPoints from './sheetSnapPoints';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type SheetProps = {
  ttree?: TNode;
  style?: StyleProp<ViewStyle>;
  children: TpChildren;
};

export default function Sheet({ ttree, children, style }: SheetProps) {
  const html = usePlaygroundSource().source;
  const { bottom: safeBottom } = useSafeAreaInsets();
  const value = useMemo(() => ({ html, ttree }), [html, ttree]);

  if (
    !sheetSnapPoints.every(
      (p) => typeof p === 'string' || typeof p === 'number'
    )
  )
    return;

  return (
    <UIBottomSheetAtom enableContentPanningGesture snapPoints={sheetSnapPoints}>
      <demoStateContext.Provider value={value}>
        <BoxNucleon grow style={[style, { paddingBottom: safeBottom }]}>
          <SheetChildrenRenderer tpChildren={children}>
            <SheetNavigator />
          </SheetChildrenRenderer>
        </BoxNucleon>
      </demoStateContext.Provider>
    </UIBottomSheetAtom>
  );
}
