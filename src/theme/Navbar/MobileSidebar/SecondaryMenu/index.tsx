import React, {type ComponentProps, type ReactNode} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useNavbarSecondaryMenu} from '@docusaurus/theme-common/internal';
import Translate from '@docusaurus/Translate';
import {ArrowLeft} from 'lucide-react';

function SecondaryMenuBackButton(props: ComponentProps<'button'>) {
  return (
    <button
      {...props}
      type="button"
      className="flex items-center gap-2 w-full px-4 min-h-12 text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors border-b border-white/[0.06] bg-surface-0 shrink-0">
      <ArrowLeft className="w-4 h-4" />
      <Translate
        id="theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel"
        description="The label of the back button to return to main menu, inside the mobile navbar sidebar secondary menu (notably used to display the docs sidebar)">
        Back to main menu
      </Translate>
    </button>
  );
}

// The secondary menu slides from the right and shows contextual information
// such as the docs sidebar
export default function NavbarMobileSidebarSecondaryMenu(): ReactNode {
  const isPrimaryMenuEmpty = useThemeConfig().navbar.items.length === 0;
  const secondaryMenu = useNavbarSecondaryMenu();
  return (
    <div className="flex flex-col h-full">
      {/* edge-case: prevent returning to the primaryMenu when it's empty */}
      {!isPrimaryMenuEmpty && (
        <SecondaryMenuBackButton onClick={() => secondaryMenu.hide()} />
      )}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {secondaryMenu.content}
      </div>
    </div>
  );
}
