import React, {type ComponentProps, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  prefersReducedMotion,
  useThemeConfig,
} from '@docusaurus/theme-common';
import {
  useHideableNavbar,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import NavbarMobileSidebar from '@theme/Navbar/MobileSidebar';
import type {Props} from '@theme/Navbar/Layout';

import styles from './styles.module.css';

function NavbarBackdrop({
  visible,
  ...props
}: ComponentProps<'div'> & {visible: boolean}) {
  const transitionClass = prefersReducedMotion()
    ? ''
    : 'transition-opacity duration-200 ease-in-out';
  return (
    <div
      role="presentation"
      {...props}
      className={clsx(
        'fixed inset-0 z-[199] bg-black/60',
        transitionClass,
        visible ? 'opacity-100' : 'opacity-0',
        props.className,
      )}
    />
  );
}

export default function NavbarLayout({children}: Props): ReactNode {
  const {
    navbar: {hideOnScroll, style},
  } = useThemeConfig();
  const mobileSidebar = useNavbarMobileSidebar();
  const {navbarRef, isNavbarVisible} = useHideableNavbar(hideOnScroll);
  return (
    <nav
      ref={navbarRef}
      aria-label={translate({
        id: 'theme.NavBar.navAriaLabel',
        message: 'Main',
        description: 'The ARIA label for the main navigation',
      })}
      className={clsx(
        ThemeClassNames.layout.navbar.container,
        'navbar',
        'navbar--fixed-top',
        hideOnScroll && [
          styles.navbarHideable,
          !isNavbarVisible && styles.navbarHidden,
        ],
        {
          'navbar--dark': style === 'dark',
          'navbar--primary': style === 'primary',
        },
      )}>
      {children}
      {mobileSidebar.shouldRender && (
        <NavbarBackdrop
          visible={mobileSidebar.shown}
          onClick={mobileSidebar.toggle}
        />
      )}
      <NavbarMobileSidebar />
    </nav>
  );
}
