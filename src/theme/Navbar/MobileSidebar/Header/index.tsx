import React, {type ReactNode} from 'react';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import IconClose from '@theme/Icon/Close';
import NavbarLogo from '@theme/Navbar/Logo';

function CloseButton() {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <button
      type="button"
      aria-label={translate({
        id: 'theme.docs.sidebar.closeSidebarButtonAriaLabel',
        message: 'Close navigation bar',
        description: 'The ARIA label for close button of mobile sidebar',
      })}
      className="flex items-center justify-center h-12 w-12 -mr-2 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
      onClick={() => mobileSidebar.toggle()}>
      <IconClose className="w-6 h-6" />
    </button>
  );
}

export default function NavbarMobileSidebarHeader(): ReactNode {
  return (
    <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06] bg-surface-0 shrink-0">
      <NavbarLogo />
      <div className="flex items-center gap-1">
        <NavbarColorModeToggle />
        <CloseButton />
      </div>
    </div>
  );
}
