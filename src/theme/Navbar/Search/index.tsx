import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/Navbar/Search';

export default function NavbarSearch({children, className}: Props): ReactNode {
  return (
    <div className={clsx(
      "relative flex items-center",
      className
    )}>
      {children}
    </div>
  );
}
