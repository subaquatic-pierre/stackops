import React from "react";
import Link from "@docusaurus/Link";
import StaticThemedImage from "@site/src/components/shared/StaticThemedImage";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 cursor-pointer hover:no-underline group"
    >
      <StaticThemedImage
        alt="StackOps Logo"
        lightSrc="/img/logo-light-theme.svg"
        darkSrc="/img/logo-dark-theme.svg"
        width="200"
        height="32"
      />
    </Link>
  );
}
