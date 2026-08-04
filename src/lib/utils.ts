import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import kebabCase from "lodash/kebabCase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Slugify a tag label into the path segment Docusaurus uses for tag pages.
 * Uses the same algorithm as Docusaurus: lodash.kebabCase, which inserts
 * hyphens at letter–digit boundaries (e.g. "ec2" → "ec-2", "s3" → "s-3").
 *
 * @example
 *   tagToSlug("aws-ec2")       // "aws-ec-2"
 *   tagToSlug("detectron2")    // "detectron-2"
 *   tagToSlug("x86-64")       // "x-86-64"
 */
export function tagToSlug(tag: string): string {
  return kebabCase(tag);
}
