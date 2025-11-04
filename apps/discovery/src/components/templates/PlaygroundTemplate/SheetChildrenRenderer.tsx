import React, { ComponentProps, isValidElement, ReactElement } from 'react';
import createPortal from './createPortal';

type PortalComponent = ReturnType<typeof createPortal>;

type PortalProps = ComponentProps<PortalComponent>;
type TpChild = ReactElement<PortalProps, PortalComponent>;
export type TpChildren = TpChild[];

export default function SheetChildrenRenderer({
  tpChildren,
  children
}: {
  children: ReactElement<{}>;
  tpChildren: TpChildren;
}) {
  let description: TpChild | undefined,
    controls: TpChild | undefined,
    navigator: TpChild | undefined;

  React.Children.forEach(tpChildren, (child) => {
    if (isValidElement(child)) {
      const childName = child.type.displayName;
      if (childName.match('SheetControlsPortal')) {
        controls = child;
      } else if (childName.match('SheetDescriptionPortal')) {
        description = child;
      } else if (childName.match('SheetNavigatorPortal')) {
        navigator = child;
      } else {
        console.warn(
          `DemoOrganism only accepts DemoOrganism.Controls and DemoOrganism.Description child elements. Instead received: ${childName}`
        );
      }
    }
  });
  if (!controls) {
    console.warn('DemoOrganism is missing a DemoOrganism.Controls child');
  }
  if (!description) {
    console.warn('DemoOrganism is missing a DemoOrganism.Description child');
  }
  const wrapper = navigator
    ? React.cloneElement(navigator, {
        ...navigator.props,
        _tpChildren: children
      })
    : children;
  if (controls && description) {
    return React.cloneElement(controls, {
      ...controls.props,
      _tpChildren: React.cloneElement(description, {
        ...description.props,
        _tpChildren: wrapper
      })
    });
  }
  return null;
}
