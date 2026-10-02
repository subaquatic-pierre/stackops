import React from "react";
import clsx from "clsx";
import styles from "./StaticThemedImage.module.css";

interface StaticThemedImageProps {
  alt: string;
  lightSrc: string;
  darkSrc: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * Drop-in replacement for @theme/ThemedImage that never does Docusaurus's
 * post-mount switch to a single React-state-chosen <img> (see
 * StaticThemedImage.module.css for why that switch can flash/collapse the
 * element). Both variants are always in the DOM; the data-theme attribute
 * selector — set synchronously before first paint — is the only thing
 * that picks which one is visible, for every render, forever.
 */
export default function StaticThemedImage({
  alt,
  lightSrc,
  darkSrc,
  width,
  height,
  className,
}: StaticThemedImageProps) {
  return (
    <>
      <img
        src={lightSrc}
        alt={alt}
        width={width}
        height={height}
        className={clsx(className, styles.themedImg, styles.light)}
      />
      <img
        src={darkSrc}
        alt={alt}
        width={width}
        height={height}
        className={clsx(className, styles.themedImg, styles.dark)}
      />
    </>
  );
}
