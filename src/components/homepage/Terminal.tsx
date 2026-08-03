import { useEffect, useRef } from "react";

const lines = [
  {
    t: '<span class="c-comment"># docs/kubernetes/deployment-template.yaml</span>',
    d: 0,
  },
  { t: '<span class="c-accent">apiVersion:</span> apps/v1', d: 300 },
  { t: '<span class="c-accent">kind:</span> Deployment', d: 600 },
  { t: '<span class="c-accent">metadata:</span>', d: 900 },
  {
    t: '&nbsp;&nbsp;<span class="c-label">name:</span> <span class="c-str">"web-api"</span>',
    d: 1100,
  },
  { t: '&nbsp;&nbsp;<span class="c-label">labels:</span>', d: 1200 },
  {
    t: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">app:</span> <span class="c-str">"api"</span>',
    d: 1300,
  },
  { t: '<span class="c-accent">spec:</span>', d: 1500 },
  {
    t: '&nbsp;&nbsp;<span class="c-label">replicas:</span> <span class="c-str">3</span>',
    d: 1700,
  },
  { t: '&nbsp;&nbsp;<span class="c-label">selector:</span>', d: 1900 },
  {
    t: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">matchLabels:</span>',
    d: 2000,
  },
  {
    t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">app:</span> <span class="c-str">"api"</span>',
    d: 2100,
  },
  { t: '&nbsp;&nbsp;<span class="c-label">template:</span>', d: 2300 },
  { t: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">spec:</span>', d: 2400 },
  {
    t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">containers:</span>',
    d: 2500,
  },
  {
    t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="c-label">name:</span> <span class="c-str">"api"</span>',
    d: 2600,
  },
  {
    t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">image:</span> <span class="c-str">"my-registry/api:latest"</span>',
    d: 2800,
  },
  {
    t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-label">ports:</span>',
    d: 3000,
  },
  {
    t: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="c-label">containerPort:</span> <span class="c-str">8080</span>',
    d: 3200,
  },
];

export default function Terminal() {
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tIdx = 0;
    let timeoutId: NodeJS.Timeout;

    const addTermLine = () => {
      if (!termRef.current) return;

      if (tIdx >= lines.length) {
        const cl = document.createElement("div");
        cl.innerHTML =
          '<span class="c-prompt">~</span> <span class="cursor"></span>';
        termRef.current.appendChild(cl);
        return;
      }

      const line = lines[tIdx];
      const div = document.createElement("div");
      div.innerHTML = line.t || "&nbsp;";
      div.style.opacity = "0";
      div.style.transition = "opacity 0.25s ease";
      termRef.current.appendChild(div);

      requestAnimationFrame(() => (div.style.opacity = "1"));

      tIdx++;
      if (tIdx < lines.length) {
        timeoutId = setTimeout(addTermLine, lines[tIdx].d - line.d);
      } else {
        timeoutId = setTimeout(addTermLine, 350);
      }
    };

    const termObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (termRef.current) termRef.current.innerHTML = "";
            tIdx = 0;
            timeoutId = setTimeout(addTermLine, 800);
            termObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (termRef.current) {
      termObs.observe(termRef.current.parentElement!);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      termObs.disconnect();
    };
  }, []);

  return (
    <div
      className="reveal terminal max-w-3xl mx-auto text-left min-h-[570px]"
      style={{ transitionDelay: "0.32s" }}
    >
      <div className="terminal-bar">
        <div className="terminal-dot" style={{ background: "#ef4444" }} />
        <div className="terminal-dot" style={{ background: "#eab308" }} />
        <div className="terminal-dot" style={{ background: "#22c55e" }} />
        <span className="ml-3 text-[11px] text-slate-500 font-mono">
          deployment-template.yaml
        </span>
      </div>
      <div
        className="p-5 sm:p-6 font-mono text-[12.5px] leading-[1.9] min-h-[220px]"
        ref={termRef}
      />
    </div>
  );
}
