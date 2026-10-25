import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { logTriageReplay } from '../data/logTriageReplay.js';

const { chunks, citations, command, source } = logTriageReplay;
const citedLines = new Set(citations.map((citation) => citation.line));
const totalAnomalies = chunks.reduce((sum, chunk) => sum + chunk.anomalies, 0);

// One flat timeline: each sample line, then the chunk's table row, then each citation check.
const events = [
  ...chunks.flatMap((chunk) => [
    ...chunk.sample.map((line) => ({ type: 'line', chunk: chunk.index, line, delay: 240 })),
    { type: 'row', chunk: chunk.index, delay: 520 },
  ]),
  ...citations.map((citation) => ({ type: 'citation', citation, delay: 700 })),
];

export default function LogTriageReplay() {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef(null);
  const started = useRef(false);

  // Start once when the replay scrolls into view; reduced motion shows the finished run.
  useEffect(() => {
    if (reducedMotion) { setStep(events.length); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        setPlaying(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!playing) return undefined;
    if (step >= events.length) { setPlaying(false); return undefined; }
    const timer = window.setTimeout(() => setStep((current) => current + 1), events[step].delay);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  const shown = events.slice(0, step);
  const visibleLines = useMemo(() => shown.filter((event) => event.type === 'line').slice(-9), [step]);
  const rows = shown.filter((event) => event.type === 'row').map((event) => chunks[event.chunk - 1]);
  const checks = shown.filter((event) => event.type === 'citation').map((event) => event.citation);
  const flagged = rows.reduce((sum, chunk) => sum + chunk.anomalies, 0);
  const finished = step >= events.length;

  const replay = () => {
    setStep(reducedMotion ? events.length : 0);
    setPlaying(!reducedMotion);
  };

  return (
    <div ref={rootRef} className="min-w-0 space-y-5 rounded-3xl border border-accent-950/80 bg-[#0B0F1A]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-7">
      <div className="flex flex-col gap-3 border-b border-accent-950/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-accent-400">Recorded stream replay</span>
          <h3 className="text-lg font-bold text-white sm:text-xl">2,000 HDFS lines, four chunks, every citation checked</h3>
          <p className="max-w-2xl text-[11px] leading-relaxed text-slate-500">
            Chunk numbers come from the repository&apos;s recorded run; the log lines are real lines from {source}. Highlighted lines are the ones the analyze run cited.
          </p>
        </div>
        <button type="button" onClick={replay} className="w-fit rounded-xl border border-accent-500/30 bg-accent-500/10 px-3 py-2 font-mono text-xs text-accent-200 transition-colors hover:bg-accent-500/20">
          {playing ? 'Playing…' : '↻ Replay'}
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#030408]">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-neon-400/70" /><span className="h-2 w-2 rounded-full bg-amber-300/70" /><span className="h-2 w-2 rounded-full bg-emerald-400/70" />
            <span className="ml-2 truncate font-mono text-[10px] text-slate-500">$ {command}</span>
          </div>
          <ol className="h-64 space-y-1 overflow-hidden p-3 font-mono text-[10px] leading-relaxed sm:text-[11px]" aria-label="Streamed log lines">
            <AnimatePresence initial={false}>
              {visibleLines.map(({ line, chunk }) => (
                <motion.li
                  key={line.n}
                  layout={!reducedMotion}
                  initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-2 truncate rounded px-1 ${citedLines.has(line.n) ? 'bg-accent-500/15 text-accent-100' : 'text-slate-400'}`}
                >
                  <span className="w-12 flex-none text-right text-slate-600">c{chunk}:{line.n}</span>
                  <span className="truncate">{line.text}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[300px] text-left font-mono text-[11px]">
              <thead className="bg-white/[0.04] text-[10px] uppercase tracking-wide text-slate-500">
                <tr><th className="px-3 py-2">Chunk</th><th className="px-2 py-2">Lines</th><th className="px-2 py-2">Tmpl</th><th className="px-2 py-2">Anom.</th><th className="px-3 py-2 text-right">Latency</th></tr>
              </thead>
              <tbody>
                {chunks.map((chunk) => {
                  const done = rows.includes(chunk);
                  return (
                    <tr key={chunk.index} className={`border-t border-white/10 transition-opacity duration-300 ${done ? 'text-slate-200' : 'text-slate-700'}`}>
                      <td className="px-3 py-2">{chunk.index}</td>
                      <td className="px-2 py-2">{done ? chunk.cumulative.toLocaleString() : '—'}</td>
                      <td className="px-2 py-2">{done ? chunk.templates : '—'}</td>
                      <td className="px-2 py-2 text-accent-300">{done ? chunk.anomalies : '—'}</td>
                      <td className={`px-3 py-2 text-right ${done && chunk.index > 1 ? 'text-emerald-300' : ''}`}>{done ? `${chunk.latencyMs.toLocaleString()} ms` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-accent-950/60 bg-[#06080F] p-3">
              <div className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Anomalies flagged</div>
              <div className="mt-1 font-mono text-lg font-bold text-white">{flagged} <span className="text-xs text-slate-500">/ {totalAnomalies}</span></div>
            </div>
            <div className="rounded-2xl border border-accent-950/60 bg-[#06080F] p-3">
              <div className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Warm-chunk speed-up</div>
              <div className="mt-1 font-mono text-lg font-bold text-white">{rows.length > 1 ? `${(chunks[0].latencyMs / rows[rows.length - 1].latencyMs).toFixed(1)}×` : '—'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#030408] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-accent-300">Citation guardrail · analyze --limit 3</span>
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] transition-colors ${finished ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-white/10 text-slate-500'}`}>
            {finished ? 'PASSED · 0.00% hallucination' : 'waiting for stream…'}
          </span>
        </div>
        <ul className="space-y-2 font-mono text-[11px]">
          {citations.map((citation) => {
            const checked = checks.includes(citation);
            return (
              <li key={citation.block} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className={checked ? 'text-emerald-300' : 'text-slate-700'}>{checked ? '✓' : '○'}</span>
                <span className="text-slate-300">{citation.block.slice(0, 18)}…</span>
                <span className="text-slate-500">cites line {citation.line}</span>
                <span className={`transition-opacity duration-300 ${checked ? 'text-slate-400 opacity-100' : 'opacity-0'}`}>→ found in active window · verified</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[10px] leading-relaxed text-slate-500">The full analyze run verified 24/24 citations. The stream and analyze runs are separate recorded commands (52 and 24 anomalies respectively).</p>
      </div>
    </div>
  );
}
