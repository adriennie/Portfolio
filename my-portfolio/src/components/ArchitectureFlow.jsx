import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Turns "Stage: what it does" lines from projects.js into nodes of an animated flow.
export function parseSteps(architecture) {
  return architecture
    .split('\n')
    .slice(1)
    .map((line) => line.replace(/^[├└]──\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const colon = line.indexOf(':');
      return colon > 0
        ? { label: line.slice(0, colon).trim(), detail: line.slice(colon + 1).trim() }
        : { label: line, detail: line };
    });
}

function Connector({ index, reducedMotion }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 24" className="mx-auto h-6 w-10 flex-none rotate-90 text-accent-400/70 lg:mx-0 lg:h-6 lg:w-10 lg:self-center lg:rotate-0">
      <motion.path
        d="M2 12 H32 M26 6 L33 12 L26 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reducedMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.45, delay: 0.15 + index * 0.18 }}
      />
    </svg>
  );
}

export default function ArchitectureFlow({ architecture }) {
  const reducedMotion = useReducedMotion();
  const steps = parseSteps(architecture);
  const heading = architecture.split('\n')[0].replace(/:$/, '');
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">{heading} · hover or focus a stage</p>
      <ol className="flex flex-col lg:flex-row lg:items-stretch" aria-label={heading}>
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            {index > 0 && <li aria-hidden="true" className="list-none lg:flex"><Connector index={index - 1} reducedMotion={reducedMotion} /></li>}
            <motion.li
              className="min-w-0 flex-1 list-none"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: index * 0.18 }}
            >
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-pressed={active === index}
                className={`flex h-full w-full flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-colors ${active === index ? 'border-accent-400/60 bg-accent-500/10 shadow-lg shadow-accent-950/40' : 'border-accent-950/60 bg-[#030408] hover:border-accent-500/30'}`}
              >
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-accent-500/30 bg-accent-500/10 text-[10px] font-mono text-accent-300">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm font-semibold text-white">{step.label}</span>
                <span className="text-[11px] leading-relaxed text-slate-400 lg:hidden">{step.detail}</span>
              </button>
            </motion.li>
          </React.Fragment>
        ))}
      </ol>
      <motion.p
        key={active}
        initial={reducedMotion ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-xs leading-relaxed text-slate-300 lg:block"
        aria-live="polite"
      >
        <span className="text-accent-300">{steps[active].label} →</span> {steps[active].detail}
      </motion.p>
    </div>
  );
}
