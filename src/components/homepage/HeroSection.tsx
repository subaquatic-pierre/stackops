import React from "react";
import Link from "@docusaurus/Link";
import { Search, Command, ArrowRight } from "lucide-react";
import { buttonVariants } from "../ui/button";
import Terminal from "./Terminal";

interface HeroSectionProps {
  searchTriggerRef?: React.RefObject<HTMLButtonElement | null>;
  onSearchOpen: () => void;
}

const floatingLines = [
  {
    top: "18%",
    left: "5%",
    transform: "rotate(-2deg)",
    text: "docs/linux/find-large-files.mdx",
  },
  {
    top: "30%",
    right: "8%",
    transform: "rotate(1.5deg)",
    text: "journal/stack-garden.mdx",
  },
  {
    top: "65%",
    left: "12%",
    transform: "rotate(-1deg)",
    text: "docs/aws/revoke-iam-keys.mdx",
  },
  {
    top: "75%",
    right: "15%",
    transform: "rotate(2deg)",
    text: "docs/kubernetes/force-delete-pod.mdx",
  },
  {
    top: "45%",
    left: "80%",
    transform: "rotate(-0.5deg)",
    text: "docs/terraform/provider-aws.mdx",
  },
];

export default function HeroSection({
  searchTriggerRef,
  onSearchOpen,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden md:pt-16 pt-16 pb-20">
      {/* Ambient orbs */}
      <div className="orb w-[500px] h-[500px] bg-accent/[0.07] -top-60 left-1/4" />
      <div className="orb w-[400px] h-[400px] bg-accent/[0.05] top-1/3 -right-20" />

      {/* Floating file labels */}
      {floatingLines.map((fl, i) => (
        <div
          key={i}
          className="float-line"
          style={{
            top: fl.top,
            left: fl.left,
            right: fl.right,
            transform: fl.transform,
          }}
        >
          {fl.text}
        </div>
      ))}

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center md:mt-12">
        {/* Badge */}
        <div className="reveal inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-black/5 dark:border-white/[0.06] bg-black/5 dark:bg-white/[0.02] text-[12px] font-medium text-slate-600 dark:text-slate-400 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          TECHNICAL REFERENCE MANUAL
        </div>

        {/* Headline */}
        <h1
          className="reveal text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.06] tracking-[-0.03em] mb-6"
          style={{ transitionDelay: "0.08s" }}
        >
          <span className="text-gradient">Software engineering through</span>
          <br />
          <span className="text-gradient-accent">an operational lens.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="reveal text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          style={{ transitionDelay: "0.16s" }}
        >
          A hybrid digital cookbook and encyclopedia for infrastructure,
          operations, and development. Built for high-speed retrieval, featuring
          actionable playbooks, architecture references, and core engineering
          concepts.
        </p>

        {/* Search trigger */}
        <div
          className="reveal max-w-xl mx-auto mb-8"
          style={{ transitionDelay: "0.2s" }}
        >
          <button
            ref={searchTriggerRef}
            type="button"
            onClick={onSearchOpen}
            className="w-full flex items-center gap-3 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-surface-2 px-4 py-3 text-left shadow-sm hover:border-accent/30 dark:hover:border-accent/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0"
            aria-label="Open search"
          >
            <Search
              className="h-5 w-5 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <span className="flex-1 text-slate-500">
              Search knowledge base…
            </span>
            <span className="hidden sm:flex items-center gap-1 rounded border border-black/5 dark:border-white/10 px-1.5 py-0.5 text-xs text-slate-500">
              <Command className="h-3 w-3" /> K
            </span>
          </button>
        </div>

        {/* CTA buttons */}
        <div
          className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          style={{ transitionDelay: "0.24s" }}
        >
          <Link
            to="/docs/"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            Explore Reference Manual
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/journal"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            View Journal
          </Link>
        </div>

        <Terminal />
      </div>
    </section>
  );
}
