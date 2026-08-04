import React from "react";
import { Layers, FileText, Braces, BookOpen } from "lucide-react";

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  delay?: string;
}

const features: FeatureCard[] = [
  {
    title: "Actionable Cookbooks",
    description:
      "Goal-oriented recipes, incident response playbooks, and copy-paste commands designed for rapid execution.",
    icon: <Layers className="w-[22px] h-[22px]" color="#3b82f6" />,
    iconBg: "bg-accent/10",
  },
  {
    title: "Reference Material",
    description:
      "Deep-dive explanations of system architectures, configuration locations, and theoretical concepts.",
    icon: <FileText className="w-[22px] h-[22px]" color="#22c55e" />,
    iconBg: "bg-emerald-500/10",
    delay: "0.08s",
  },
  {
    title: "Flat Architecture",
    description:
      "Content organized in flat directories with front-matter tags and full-text search. No nested sub-folders — metadata drives discovery.",
    icon: <Braces className="w-[22px] h-[22px]" color="#f59e0b" />,
    iconBg: "bg-amber-500/10",
    delay: "0.16s",
  },
  {
    title: "Engineering Journal",
    description:
      "A running log of projects, homelab experiments, and technical articles — captured as dated entries alongside the reference material.",
    icon: <BookOpen className="w-[22px] h-[22px]" color="#8b5cf6" />,
    iconBg: "bg-violet-500/10",
    delay: "0.24s",
  },
];

export default function PillarsSection() {
  return (
    <section id="pillars" className="relative py-24 sm:py-32">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="reveal text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-4">
            Architecture
          </p>
          <h2
            className="reveal text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ transitionDelay: "0.08s" }}
          >
            System documentation.
            <br />
            <span className="text-gradient-accent">Infrastructure patterns.</span>
          </h2>
          <p
            className="reveal text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed"
            style={{ transitionDelay: "0.16s" }}
          >
            Centralized documentation covering system configurations,
            infrastructure state, and operational runbooks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ title, description, icon, iconBg, delay }) => (
            <div
              key={title}
              className="reveal custom-card p-7 sm:p-6 lg:p-7"
              style={delay ? { transitionDelay: delay } : undefined}
            >
              <div className={`feature-icon ${iconBg} mb-5`}>
                {icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="reveal text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
