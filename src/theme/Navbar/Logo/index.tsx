import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';

export default function NavbarLogo(): ReactNode {
  return (
    <Link to="/" className="flex items-center gap-2.5 cursor-pointer hover:no-underline group mr-4">
      <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center transition-transform group-hover:scale-105">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
          <line x1="4" y1="22" x2="4" y2="15"/>
        </svg>
      </div>
      <span className="text-base font-bold text-white tracking-tight">StackOps</span>
    </Link>
  );
}
