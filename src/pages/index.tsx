import React, { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Search, Command } from 'lucide-react';
import HomepageSearchModal from '../components/shared/HomepageSearchModal';

const termLines = [
  { t: '<span class="c-comment"># docs/kubernetes/deployment-template.yaml</span>', d: 0 },
  { t: '<span class="c-accent">apiVersion:</span> apps/v1', d: 300 },
  { t: '<span class="c-accent">kind:</span> Deployment', d: 600 },
  { t: '<span class="c-accent">metadata:</span>', d: 900 },
  { t: '&nbsp;&nbsp;<span class="c-label">name:</span> <span class="c-str">"web-api"</span>', d: 1100 },
  { t: '&nbsp;&nbsp;<span class="c-label">labels:</span>', d: 1200 },
  { t: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">app:</span> <span class="c-str">"api"</span>', d: 1300 },
  { t: '<span class="c-accent">spec:</span>', d: 1500 },
  { t: '&nbsp;&nbsp;<span class="c-label">replicas:</span> <span class="c-str">3</span>', d: 1700 },
  { t: '&nbsp;&nbsp;<span class="c-label">selector:</span>', d: 1900 },
  { t: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">matchLabels:</span>', d: 2000 },
  { t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">app:</span> <span class="c-str">"api"</span>', d: 2100 },
  { t: '&nbsp;&nbsp;<span class="c-label">template:</span>', d: 2300 },
  { t: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">spec:</span>', d: 2400 },
  { t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">containers:</span>', d: 2500 },
  { t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="c-label">name:</span> <span class="c-str">"api"</span>', d: 2600 },
  { t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">image:</span> <span class="c-str">"my-registry/api:latest"</span>', d: 2800 },
  { t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">ports:</span>', d: 3000 },
  { t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="c-label">containerPort:</span> <span class="c-str">8080</span>', d: 3200 },
];

function Terminal() {
  const termRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let tIdx = 0;
    let timeoutId: NodeJS.Timeout;

    const addTermLine = () => {
      if (!termRef.current) return;

      if (tIdx >= termLines.length) {
        const cl = document.createElement('div');
        cl.innerHTML = '<span class="c-prompt">~</span> <span class="cursor"></span>';
        termRef.current.appendChild(cl);
        return;
      }
      
      const line = termLines[tIdx];
      const div = document.createElement('div');
      div.innerHTML = line.t || '&nbsp;';
      div.style.opacity = '0';
      div.style.transition = 'opacity 0.25s ease';
      termRef.current.appendChild(div);
      
      requestAnimationFrame(() => div.style.opacity = '1');

      tIdx++;
      if (tIdx < termLines.length) {
        timeoutId = setTimeout(addTermLine, termLines[tIdx].d - line.d);
      } else {
        timeoutId = setTimeout(addTermLine, 350);
      }
    };

    const termObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (termRef.current) termRef.current.innerHTML = '';
          tIdx = 0;
          timeoutId = setTimeout(addTermLine, 800);
          termObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    
    if (termRef.current) {
      termObs.observe(termRef.current.parentElement!);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      termObs.disconnect();
    };
  }, []);

  return (
    <div className="reveal terminal max-w-3xl mx-auto text-left" style={{ transitionDelay: '0.32s' }}>
      <div className="terminal-bar">
        <div className="terminal-dot" style={{ background: '#ef4444' }}></div>
        <div className="terminal-dot" style={{ background: '#eab308' }}></div>
        <div className="terminal-dot" style={{ background: '#22c55e' }}></div>
        <span className="ml-3 text-[11px] text-slate-500 font-mono">deployment-template.yaml</span>
      </div>
      <div className="p-5 sm:p-6 font-mono text-[12.5px] leading-[1.9] min-h-[220px]" ref={termRef}></div>
    </div>
  );
}

function RevealOnScroll() {
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
    return () => revealObs.disconnect();
  }, []);
  return null;
}

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <HomepageSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        triggerRef={searchTriggerRef}
      />
      <Layout
        title="Technical Reference Manual"
        description="Software engineering through an operational lens.">
        <div className="bg-white dark:bg-surface-0 text-slate-900 dark:text-white antialiased bg-grid min-h-screen font-sans transition-colors duration-200">
          <RevealOnScroll />

          {/* HERO SECTION */}
          <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 pb-20">
            <div className="orb w-[500px] h-[500px] bg-accent/[0.07] -top-60 left-1/4"></div>
            <div className="orb w-[400px] h-[400px] bg-brand/[0.05] top-1/3 -right-20"></div>

            <div className="float-line" style={{ top: '18%', left: '5%', transform: 'rotate(-2deg)' }}>docs/linux/find-large-files.mdx</div>
            <div className="float-line" style={{ top: '30%', right: '8%', transform: 'rotate(1.5deg)' }}>projects/stack-garden.mdx</div>
            <div className="float-line" style={{ top: '65%', left: '12%', transform: 'rotate(-1deg)' }}>docs/aws/revoke-iam-keys.mdx</div>
            <div className="float-line" style={{ top: '75%', right: '15%', transform: 'rotate(2deg)' }}>docs/kubernetes/force-delete-pod.mdx</div>
            <div className="float-line" style={{ top: '45%', left: '80%', transform: 'rotate(-0.5deg)' }}>docs/terraform/provider-aws.mdx</div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-12">
              <div className="reveal inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-black/5 dark:border-white/[0.06] bg-black/5 dark:bg-white/[0.02] text-[12px] font-medium text-slate-600 dark:text-slate-400 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                TECHNICAL REFERENCE MANUAL
              </div>

              <h1 className="reveal text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.06] tracking-[-0.03em] mb-6" style={{ transitionDelay: '0.08s' }}>
                <span className="text-gradient">Software engineering through</span><br />
                <span className="text-gradient-accent">an operational lens.</span>
              </h1>

              <p className="reveal text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light" style={{ transitionDelay: '0.16s' }}>
                A hybrid digital cookbook and encyclopedia for infrastructure, operations, and development. Built for high-speed retrieval, featuring actionable playbooks, architecture references, and core engineering concepts.
              </p>

              <div className="reveal max-w-xl mx-auto mb-8" style={{ transitionDelay: '0.2s' }}>
                <button
                  ref={searchTriggerRef}
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full flex items-center gap-3 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-surface-2 px-4 py-3 text-left shadow-sm hover:border-brand/30 dark:hover:border-brand/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="flex-1 text-slate-500">Search knowledge base…</span>
                  <span className="hidden sm:flex items-center gap-1 rounded border border-black/5 dark:border-white/10 px-1.5 py-0.5 text-xs text-slate-500">
                    <Command className="h-3 w-3" /> K
                  </span>
                </button>
              </div>

              <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 mb-16" style={{ transitionDelay: '0.24s' }}>
                <Link to="/docs/" className="btn-primary cursor-pointer hover:text-white dark:hover:text-[#09090b] hover:no-underline">
                  Explore Reference Manual
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
                <Link to="/engineering" className="btn-secondary cursor-pointer hover:text-slate-900 dark:hover:text-white hover:no-underline text-slate-700 dark:text-slate-200">
                  View Engineering
                </Link>
              </div>

              <Terminal />
            </div>
          </section>
        
        {/* CONCEPTS STRIP */}
        <section id="concepts" className="relative py-20 border-y border-black/5 dark:border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-6">
            <p className="reveal text-center text-[11px] uppercase tracking-[0.2em] text-slate-500 font-medium mb-10">Core Technologies & Domains</p>
            <div className="reveal flex flex-wrap justify-center gap-3" style={{ transitionDelay: '0.1s' }}>
              <Link to="/docs/linux" className="concept-pill hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg> Linux & Systems</Link>
              <Link to="/docs/aws" className="concept-pill hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> AWS Cloud</Link>
              <Link to="/docs/kubernetes" className="concept-pill hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> Kubernetes</Link>
              <Link to="/docs/terraform" className="concept-pill hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg> Terraform</Link>
              <Link to="/docs/docker" className="concept-pill hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> Docker</Link>
              <Link to="/docs/system-architecture" className="concept-pill hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> System Architecture</Link>
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section id="pillars" className="relative py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="reveal text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-4">Architecture</p>
              <h2 className="reveal text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ transitionDelay: '0.08s' }}>
                System documentation.<br />
                <span className="text-gradient-accent">Infrastructure patterns.</span>
              </h2>
              <p className="reveal text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed" style={{ transitionDelay: '0.16s' }}>
                Centralized documentation covering system configurations, infrastructure state, and operational runbooks.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="reveal custom-card p-7 sm:p-6 lg:p-7">
                <div className="feature-icon bg-blue-500/10 mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Actionable Cookbooks</h3>
                <p className="reveal text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  Goal-oriented recipes, incident response playbooks, and copy-paste commands designed for rapid execution.
                </p>
              </div>
              
              <div className="reveal custom-card p-7 sm:p-6 lg:p-7" style={{ transitionDelay: '0.08s' }}>
                <div className="feature-icon bg-emerald-500/10 mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="M9 18l3-3-3-3"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Reference Material</h3>
                <p className="reveal text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  Deep-dive explanations of system architectures, configuration locations, and theoretical concepts.
                </p>
              </div>
              
              <div className="reveal custom-card p-7 sm:p-6 lg:p-7" style={{ transitionDelay: '0.16s' }}>
                <div className="feature-icon bg-amber-500/10 mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Tag-Based Discovery</h3>
                <p className="reveal text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  Flat directory structures powered by robust front-matter tags and full-text search. Ensures immediate content retrieval without deep hierarchies.
                </p>
              </div>

              <div className="reveal custom-card p-7 sm:p-6 lg:p-7" style={{ transitionDelay: '0.24s' }}>
                <div className="feature-icon bg-violet-500/10 mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Project Showcase</h3>
                <p className="reveal text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  A portfolio integrated into the platform to display past engineering work and open-source contributions.
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </Layout>
    </>
  );
}