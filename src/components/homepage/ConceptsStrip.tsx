import React from "react";
import Link from "@docusaurus/Link";
import { Layers, Shield, Cog, Box, Code2 } from "lucide-react";

interface ConceptPill {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const concepts: ConceptPill[] = [
  { to: "/docs/linux", label: "Linux & Systems", Icon: Layers },
  { to: "/docs/aws", label: "AWS Cloud", Icon: Shield },
  { to: "/docs/kubernetes", label: "Kubernetes", Icon: Cog },
  { to: "/docs/terraform", label: "Terraform", Icon: Box },
  { to: "/docs/docker", label: "Docker", Icon: Cog },
  { to: "/docs/system-architecture", label: "System Architecture", Icon: Code2 },
];

export default function ConceptsStrip() {
  return (
    <section
      id="concepts"
      className="relative py-20 border-y border-black/5 dark:border-white/[0.04]"
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="reveal text-center text-[11px] uppercase tracking-[0.2em] text-slate-500 font-medium mb-10">
          Core Technologies &amp; Domains
        </p>
        <div
          className="reveal flex flex-wrap justify-center gap-3"
          style={{ transitionDelay: "0.1s" }}
        >
          {concepts.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className="concept-pill hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0"
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
