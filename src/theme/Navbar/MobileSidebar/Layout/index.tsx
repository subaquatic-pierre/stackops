import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {
  useNavbarMobileSidebar,
  useNavbarSecondaryMenu,
} from '@docusaurus/theme-common/internal';
import {prefersReducedMotion, ThemeClassNames} from '@docusaurus/theme-common';
import type {Props} from '@theme/Navbar/MobileSidebar/Layout';

function NavbarMobileSidebarPanel({
  children,
  inert,
}: {
  children: ReactNode;
  inert: boolean;
}) {
  return (
    <div
      className={clsx(
        ThemeClassNames.layout.navbar.mobileSidebar.panel,
        'w-1/2 h-full overflow-y-auto overflow-x-hidden',
      )}
      inert={inert}>
      {children}
    </div>
  );
}

function useMotionSafeTransition(): string {
  return prefersReducedMotion() ? '' : 'transition-transform duration-200 ease-in-out';
}

export default function NavbarMobileSidebarLayout({
  header,
  primaryMenu,
  secondaryMenu,
}: Props): ReactNode {
  const {shown} = useNavbarMobileSidebar();
  const {shown: secondaryMenuShown} = useNavbarSecondaryMenu();
  const transitionClass = useMotionSafeTransition();

  return (
    <div
      className={clsx(
        ThemeClassNames.layout.navbar.mobileSidebar.container,
        'fixed top-0 left-0 z-[200] h-screen w-[300px]',
        'bg-surface-0 border-r border-white/[0.06]',
        'flex flex-col',
        transitionClass,
        shown ? 'translate-x-0' : '-translate-x-full',
      )}>
      {header}
      <div
        className={clsx(
          'flex flex-1 w-[200%]',
          transitionClass,
          secondaryMenuShown ? '-translate-x-1/2' : 'translate-x-0',
        )}>
        <NavbarMobileSidebarPanel inert={secondaryMenuShown}>
          {primaryMenu}
        </NavbarMobileSidebarPanel>
        <NavbarMobileSidebarPanel inert={!secondaryMenuShown}>
          {secondaryMenu}
        </NavbarMobileSidebarPanel>
      </div>
    </div>
  );
}
