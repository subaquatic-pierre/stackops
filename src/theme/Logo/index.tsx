import React from "react";
import Link from "@docusaurus/Link";
import ThemedImage from "@theme/ThemedImage";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 cursor-pointer hover:no-underline group"
    >
      <ThemedImage
        alt="StackOps Logo"
        sources={{
          light: "/img/logo-light-theme.svg",
          dark: "/img/logo-dark-theme.svg",
        }}
        width="130"
        height="26"
      />
    </Link>
  );
}
