import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { logTriageReplay } from '../data/logTriageReplay.js';

const BASE_URL = `${import.meta.env.BASE_URL}/`;

// Recorded values, copied from each project's checked-in results.
const throughput = [
  { batch: 1, vllm: 30.05, hf: 18.77 },
  { batch: 2, vllm: 50.13, hf: 18.19 },
  { batch: 4, vllm: 116.06, hf: 36.04 },
  { batch: 8, vllm: 226.98, hf: 61.42 },
  { batch: 16, vllm: 270.61, hf: 107.0 },
  { batch: 32, vllm: 877.69, hf: 173.45 },
];
const ranks = [
  { rank: 4, params: 544768, loss: 2.4458 },
  { rank: 8, params: 1089536, loss: 2.4438 },
  { rank: 16, params: 2179072, loss: 2.4248 },
];
const verdicts = [
  { label: 'Privacy verdicts · development', value: 148, total: 149 },
  { label: 'Privacy verdicts · holdout', value: 49, total: 49 },
  { label: 'Answers matching reference numbers', value: 53, total: 87 },
];

function Bar({ ratio, index, className, vertical = false }) {
  const reducedMotion = useReducedMotion();
  const style = vertical ? { height: `${Math.max(ratio * 100, 2)}%`, transformOrigin: '50% 100%' } : { width: `${Math.max(ratio * 100, 1.5)}%`, transformOrigin: '0 50%' };
  return (
    <motion.span
      className={`block rounded-sm ${className}`}
      style={style}
      initial={reducedMotion ? false : vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.08, ease: [0.2, 0.75, 0.25, 1] }}
    />
  );
}

function Caption({ children }) {
  return <p className="mt-4 font-mono text-[10px] leading-relaxed text-slate-500">{children}</p>;
}

function ThroughputChart() {
  const max = 900;
  return (
    <div>
      <div className="flex h-44 items-end gap-3 sm:h-52" role="img" aria-label="Throughput in tokens per second by batch size: vLLM reaches 877.69 at batch 32 versus 173.45 for Hugging Face Transformers.">
        {throughput.map((row, index) => (
          <div key={row.batch} className="flex h-full flex-1 flex-col justify-end gap-1">
            <div className="flex h-full items-end gap-1">
              <Bar vertical ratio={row.vllm / max} index={index} className="w-1/2 bg-gradient-to-t from-accent-600 to-accent-400" />
              <Bar vertical ratio={row.hf / max} index={index} className="w-1/2 bg-slate-600" />
            </div>
            <span className="text-center font-mono text-[10px] text-slate-500">{row.batch}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-accent-500" />vLLM</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-slate-600" />HF Transformers</span>
        <span>tok/s by batch size</span>
      </div>
      <Caption>Notebook measurements on one Tesla T4. A separate generate() run puts batch 32 at 1.43×, not 5.06×.</Caption>
    </div>
  );
}

function ChunkChart() {
  const { chunks } = logTriageReplay;
  const max = Math.max(...chunks.map((chunk) => chunk.latencyMs));
  return (
    <div>
      <div className="space-y-3" role="img" aria-label="Latency per 500-line chunk drops from 1,716 milliseconds to about 78 after the first chunk.">
        {chunks.map((chunk, index) => (
          <div key={chunk.index} className="grid grid-cols-[4.5rem_1fr_5.5rem] items-center gap-3 font-mono text-[11px]">
            <span className="text-slate-500">chunk {chunk.index}</span>
            <span className="h-3 rounded-sm bg-slate-900"><Bar ratio={chunk.latencyMs / max} index={index} className={`h-3 ${index === 0 ? 'bg-slate-500' : 'bg-gradient-to-r from-accent-600 to-accent-400'}`} /></span>
            <span className="text-right text-slate-300">{chunk.latencyMs.toLocaleString()} ms</span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        {[['2,000', 'lines streamed'], ['52', 'anomalies flagged'], ['24/24', 'citations verified']].map(([value, label]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3">
            <div className="font-mono text-base font-bold text-white">{value}</div>
            <div className="mt-1 text-[10px] text-slate-500">{label}</div>
          </div>
        ))}
      </div>
      <Caption>Recorded HDFS_2k run. Warm chunks reuse Drain3 state and cached vectors.</Caption>
    </div>
  );
}

function RankChart() {
  const max = ranks.at(-1).params;
  return (
    <div>
      <div className="space-y-4" role="img" aria-label="Trainable parameters double with each rank: 544,768 at rank 4, 1,089,536 at rank 8, 2,179,072 at rank 16.">
        {ranks.map((row, index) => (
          <div key={row.rank} className="space-y-1.5">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-300">r = {row.rank}</span>
              <span className="text-slate-500">{row.params.toLocaleString()} params · loss {row.loss}</span>
            </div>
            <span className="block h-3 rounded-sm bg-slate-900"><Bar ratio={row.params / max} index={index} className="h-3 bg-gradient-to-r from-accent-600 to-neon-400" /></span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-[11px] text-slate-300">
        <span className="rounded-md border border-accent-400/30 bg-accent-400/10 px-2 py-1">3 adapters</span>
        <span className="text-accent-400">→</span>
        <span className="rounded-md border border-white/10 px-2 py-1">1 vLLM engine</span>
      </div>
      <Caption>Training loss on four repeated examples, one run per rank: not a generalization result.</Caption>
    </div>
  );
}

function VerdictMeters() {
  return (
    <div>
      <div className="space-y-4">
        {verdicts.map((row, index) => (
          <div key={row.label} className="space-y-1.5">
            <div className="flex justify-between gap-3 font-mono text-[11px]">
              <span className="text-slate-300">{row.label}</span>
              <span className="flex-none text-white">{row.value}/{row.total}</span>
            </div>
            <span className="block h-3 rounded-sm bg-slate-900" role="img" aria-label={`${row.label}: ${row.value} of ${row.total}`}><Bar ratio={row.value / row.total} index={index} className="h-3 bg-gradient-to-r from-accent-600 to-accent-400" /></span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-3 font-mono text-[11px]">
        <span className="text-slate-300">Forbidden requests marked compliant</span>
        <span className="text-lg font-bold text-emerald-300">0/117</span>
      </div>
      <Caption>Self-hosted Qwen3.6-27B on synthetic cohorts. Verdict accuracy and answer correctness are separate measures.</Caption>
    </div>
  );
}

function FlowSteps({ project }) {
  return (
    <ol className="grid grid-cols-2 gap-3">
      {project.preview.steps.map((step, index) => (
        <li key={step.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <span className="font-mono text-[10px] text-accent-400">0{index + 1}</span>
          <p className="mt-1 text-sm font-semibold text-white">{step.label}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}

function StatList({ project }) {
  return (
    <dl className="grid gap-3">
      {project.stats.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <dt className="mt-1 text-[11px] text-slate-500">{stat.label}</dt>
          <dd className="font-mono text-lg font-bold text-white">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ProjectEvidence({ project }) {
  switch (project.card.visual) {
    case 'throughput': return <ThroughputChart />;
    case 'chunks': return <ChunkChart />;
    case 'ranks': return <RankChart />;
    case 'verdicts': return <VerdictMeters />;
    case 'flow': return project.preview ? <FlowSteps project={project} /> : <StatList project={project} />;
    case 'screenshot':
      return project.gallery?.[0] ? (
        <img src={`${BASE_URL}${project.gallery[0].src}`} alt={project.gallery[0].alt} loading="lazy" decoding="async" width="1280" height="720" className="w-full rounded-xl border border-white/10" />
      ) : <StatList project={project} />;
    default: return <StatList project={project} />;
  }
}
