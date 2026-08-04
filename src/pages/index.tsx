import React, { useRef, useState } from "react";
import Layout from "@theme/Layout";
import SearchModal from "../components/shared/SearchModal";
import RevealOnScroll from "../components/homepage/RevealOnScroll";
import HeroSection from "../components/homepage/HeroSection";
import ConceptsStrip from "../components/homepage/ConceptsStrip";
import PillarsSection from "../components/homepage/PillarsSection";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        // triggerRef={searchTriggerRef}
      />
      <Layout
        title="Technical Reference"
        description="A practical software engineering reference covering cloud infrastructure, Kubernetes, Linux, networking, virtualization, databases, DevOps, and modern software architecture."
      >
        <div className="bg-white dark:bg-surface-0 text-slate-900 dark:text-white antialiased bg-grid min-h-screen font-sans transition-colors duration-200">
          <RevealOnScroll />

          <HeroSection
            // searchTriggerRef={searchTriggerRef}
            onSearchOpen={() => setIsSearchOpen(true)}
          />

          <ConceptsStrip />

          <PillarsSection />
        </div>
      </Layout>
    </>
  );
}
