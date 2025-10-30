/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import clsx from 'clsx';
import { useThemeConfig, useWindowSize } from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Logo from '@theme/Logo';
import IconArrow from '@theme/Icon/Arrow';
import IconMenu from '@theme/Icon/Menu';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';
const MOBILE_TOGGLE_SIZE = 24;

const normalizePath = (p) => (p || '').replace(/\/$/, '');
const isActiveSidebarItem = (item, activePath) => {
  if (item.type === 'link') {
    return normalizePath(item.href) === normalizePath(activePath);
  }

  if (item.type === 'category') {
    return item.items.some((subItem) =>
      isActiveSidebarItem(subItem, activePath)
    );
  }

  return false;
}; // Optimize sidebar at each "level"
// TODO this item should probably not receive the "activePath" props
// TODO this triggers whole sidebar re-renders on navigation

const DocSidebarItems = memo(function DocSidebarItems({ items, ...props }) {
  return items.map((item, index) => (
    <DocSidebarItem
      key={index} // sidebar is static, the index does not change
      item={item}
      {...props}
    />
  ));
});

function DocSidebarItem(props) {
  switch (props.item.type) {
    case 'category':
      return <DocSidebarItemCategory {...props} />;

    case 'link':
    default:
      return <DocSidebarItemLink {...props} />;
  }
}

function DocSidebarItemCategory({ item, onItemClick, activePath, ...props }) {
  const { items, label } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const menuListRef = useRef(null);

  if (items.length === 0) {
    return null;
  }

  return (
    <li className={clsx('menu__list-item')}>
      <span
        className={clsx('menu__link', {
          'menu__link--sublist': true,
          'menu__link--active': isActive,
          [styles.menuLinkText]: false
        })}
        {...props}>
        {label}
      </span>
      <ul className="menu__list" ref={menuListRef}>
        <DocSidebarItems
          items={items}
          tabIndex="0"
          onItemClick={onItemClick}
          activePath={activePath}
        />
      </ul>
    </li>
  );
}

function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  collapsible: _collapsible,
  ...props
}) {
  const { href, label } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  return (
    <li className="menu__list-item" key={label}>
      <Link
        className={clsx('menu__link', {
          'menu__link--active': isActive,
          [styles.menuLinkExternal]: !isInternalUrl(href)
        })}
        to={href}
        {...(isInternalUrl(href) && {
          isNavLink: true,
          exact: true,
          onClick: onItemClick
        })}
        {...props}>
        {label}
      </Link>
    </li>
  );
}

function useShowAnnouncementBar() {
  return false;
}

function useResponsiveSidebar() {
  const [showResponsiveSidebar, setShowResponsiveSidebar] = useState(false);
  // Local replacement for removed useLockBodyScroll in Docusaurus v3
  useEffect(() => {
    if (showResponsiveSidebar) {
      const { overflow } = document.body.style;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = overflow || '';
      };
    }
    return undefined;
  }, [showResponsiveSidebar]);
  const windowSize = useWindowSize();
  useEffect(() => {
    if (windowSize === 'desktop') {
      setShowResponsiveSidebar(false);
    }
  }, [windowSize]);
  const closeResponsiveSidebar = useCallback(
    (e) => {
      e.target.blur();
      setShowResponsiveSidebar(false);
    },
    [setShowResponsiveSidebar]
  );
  const toggleResponsiveSidebar = useCallback(() => {
    setShowResponsiveSidebar((value) => !value);
  }, [setShowResponsiveSidebar]);
  return {
    showResponsiveSidebar,
    closeResponsiveSidebar,
    toggleResponsiveSidebar
  };
}

function HideableSidebarButton({ onClick }) {
  return (
    <button
      type="button"
      title={translate({
        id: 'theme.docs.sidebar.collapseButtonTitle',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar'
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.collapseButtonAriaLabel',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar'
      })}
      className={clsx(
        'button button--secondary button--outline',
        styles.collapseSidebarButton
      )}
      onClick={onClick}>
      <IconArrow className={styles.collapseSidebarButtonIcon} />
    </button>
  );
}

function ResponsiveSidebarButton({ responsiveSidebarOpened, onClick }) {
  return (
    <button
      aria-label={
        responsiveSidebarOpened
          ? translate({
              id: 'theme.docs.sidebar.responsiveCloseButtonLabel',
              message: 'Close menu',
              description:
                'The ARIA label for close button of mobile doc sidebar'
            })
          : translate({
              id: 'theme.docs.sidebar.responsiveOpenButtonLabel',
              message: 'Open menu',
              description:
                'The ARIA label for open button of mobile doc sidebar'
            })
      }
      aria-haspopup="true"
      className="button button--secondary button--sm menu__button"
      type="button"
      onClick={onClick}>
      {responsiveSidebarOpened ? (
        <span
          className={clsx(styles.sidebarMenuIcon, styles.sidebarMenuCloseIcon)}>
          &times;
        </span>
      ) : (
        <IconMenu
          className={styles.sidebarMenuIcon}
          height={MOBILE_TOGGLE_SIZE}
          width={MOBILE_TOGGLE_SIZE}
        />
      )}
    </button>
  );
}

function DocSidebar({
  path,
  sidebar,
  sidebarCollapsible = true,
  onCollapse,
  isHidden
}) {
  const showAnnouncementBar = useShowAnnouncementBar();
  const {
    navbar: { hideOnScroll },
    hideableSidebar
  } = useThemeConfig();
  const {
    showResponsiveSidebar,
    closeResponsiveSidebar,
    toggleResponsiveSidebar
  } = useResponsiveSidebar();
  return (
    <div
      className={clsx(styles.sidebar, {
        [styles.sidebarWithHideableNavbar]: hideOnScroll,
        [styles.sidebarHidden]: isHidden
      })}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <div
        className={clsx(
          'menu',
          'menu--responsive',
          'thin-scrollbar',
          styles.menu,
          {
            'menu--show': showResponsiveSidebar,
            [styles.menuWithAnnouncementBar]: false
          }
        )}>
        <ResponsiveSidebarButton
          responsiveSidebarOpened={showResponsiveSidebar}
          onClick={toggleResponsiveSidebar}
        />
        <ul className="menu__list">
          <DocSidebarItems
            items={sidebar}
            onItemClick={closeResponsiveSidebar}
            collapsible={sidebarCollapsible}
            activePath={path}
          />
        </ul>
      </div>
      {hideableSidebar && <HideableSidebarButton onClick={onCollapse} />}
    </div>
  );
}

export default DocSidebar;
