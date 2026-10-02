import React from "react";
import clsx from "clsx";
import styles from "./StaticThemedIcon.module.css";

interface StaticThemedIconProps {
  /** Rendered when the resolved theme is light. */
  light: React.ReactElement<{ className?: string }>;
  /** Rendered when the resolved theme is dark. */
  dark: React.ReactElement<{ className?: string }>;
}

/**
 * Same fix as StaticThemedImage, applied to theme-dependent icons (see
 * StaticThemedIcon.module.css). Use for things like the dark-mode toggle's
 * sun/moon icon instead of branching on useColorMode()'s colorMode.
 */
export default function StaticThemedIcon({ light, dark }: StaticThemedIconProps) {
  return (
    <>
      {React.cloneElement(light, {
        className: clsx(light.props.className, styles.themedIcon, styles.light),
      })}
      {React.cloneElement(dark, {
        className: clsx(dark.props.className, styles.themedIcon, styles.dark),
      })}
    </>
  );
}
