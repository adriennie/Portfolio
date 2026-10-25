import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const benchmarkData = {
  1: { transformers: 18.77, vllm: 30.05, generate: 19.72 },
  2: { transformers: 18.19, vllm: 50.13, generate: 42.87 },
  4: { transformers: 36.04, vllm: 116.06, generate: 83.91 },
  8: { transformers: 61.42, vllm: 226.98, generate: 163.31 },
  16: { transformers: 107.00, vllm: 270.61, generate: 325.02 },
  32: { transformers: 173.45, vllm: 877.69, generate: 613.65 },
};

const batchSizes = Object.keys(benchmarkData).map(Number);

// Illustration only: the notebook did not record vLLM memory, so these cells model the idea, not a measurement.
const BLOCK_TOKENS = 16;
const PROMPT_TOKENS = 32;
const MAX_NEW_TOKENS = 128;
const GRID_COLUMNS = 16;
const GRID_CELLS = 256;
const MAX_BLOCKS = Math.ceil((PROMPT_TOKENS + MAX_NEW_TOKENS) / BLOCK_TOKENS);
const SEQUENCE_COLORS = ['bg-accent-400', 'bg-neon-400', 'bg-violet-400', 'bg-sky-400', 'bg-amber-300', 'bg-emerald-400'];

// Deterministic "generated length" per sequence so the picture is stable between renders.
const generatedTokens = (seq) => 24 + ((seq * 37 + 11) % (MAX_NEW_TOKENS - 23));
const blocksNeeded = (seq, progress) => Math.ceil((PROMPT_TOKENS + generatedTokens(seq) * progress) / BLOCK_TOKENS);

function layoutContiguous(batch, progress) {
  const cells = Array(GRID_CELLS).fill(null);
  let admitted = 0;
  for (let seq = 0; seq < batch; seq += 1) {
    const start = seq * MAX_BLOCKS;
    if (start + MAX_BLOCKS > GRID_CELLS) break;
    admitted += 1;
    const used = blocksNeeded(seq, progress);
    for (let b = 0; b < MAX_BLOCKS; b += 1) cells[start + b] = { seq, used: b < used };
  }
  const usedCells = cells.filter((cell) => cell?.used).length;
  const reservedCells = cells.filter(Boolean).length;
  return { cells, admitted, waste: reservedCells ? 1 - usedCells / reservedCells : 0, reservedCells };
}

function layoutPaged(batch, progress) {
  const cells = Array(GRID_CELLS).fill(null);
  const target = Array.from({ length: batch }, (_, seq) => blocksNeeded(seq, progress));
  const given = Array(batch).fill(0);
  let next = 0;
  // Blocks are handed out round-robin as tokens arrive, so each sequence's pages end up scattered.
  for (let round = 0; round < MAX_BLOCKS && next < GRID_CELLS; round += 1) {
    for (let seq = 0; seq < batch && next < GRID_CELLS; seq += 1) {
      if (given[seq] < target[seq]) { cells[next] = { seq, used: true }; given[seq] += 1; next += 1; }
    }
  }
  const admitted = given.filter((count, seq) => count === target[seq]).length;
  const tokens = Array.from({ length: batch }, (_, seq) => PROMPT_TOKENS + generatedTokens(seq) * progress).reduce((a, b) => a + b, 0);
  return { cells, admitted, waste: next ? 1 - tokens / (next * BLOCK_TOKENS) : 0, reservedCells: next };
}

function MemoryGrid({ title, layout, batch, note }) {
  return (
    <div className="min-w-0 space-y-2 rounded-2xl border border-accent-950/60 bg-[#06080F] p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wide text-slate-300">{title}</span>
        <span className="font-mono text-[10px] text-slate-500">{layout.admitted}/{batch} sequences fit</span>
      </div>
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))` }} aria-hidden="true">
        {layout.cells.map((cell, index) => (
          <span
            key={index}
            className={`aspect-square rounded-[2px] transition-colors duration-200 ${cell ? (cell.used ? SEQUENCE_COLORS[cell.seq % SEQUENCE_COLORS.length] : 'border border-dashed border-slate-600 bg-slate-800/40') : 'bg-slate-900'}`}
          />
        ))}
      </div>
      <p className="font-mono text-[10px] text-slate-400">
        {Math.round(layout.waste * 100)}% of reserved slots unused · {note}
      </p>
    </div>
  );
}

function KvCacheVisual({ batchSize }) {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (reducedMotion) { setProgress(1); return undefined; }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const value = Math.min((now - start) / 1800, 1);
      setProgress(value);
      if (value < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [batchSize, reducedMotion]);

  const contiguous = layoutContiguous(batchSize, progress);
  const paged = layoutPaged(batchSize, progress);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-accent-300">Why paging helps · illustration</span>
          <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-500">
            Each cell is one 16-token KV block in a fixed memory budget. Contiguous allocation reserves the maximum length for every sequence up front; PagedAttention hands out blocks as tokens arrive. Not measured: the notebook did not record vLLM memory.
          </p>
        </div>
        <div className="flex gap-3 font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-[2px] bg-accent-400" />used</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-[2px] border border-dashed border-slate-600 bg-slate-800/40" />reserved, unused</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MemoryGrid title="Contiguous per-sequence cache" layout={contiguous} batch={batchSize} note="the rest wait" />
        <MemoryGrid title="PagedAttention · 16-token blocks" layout={paged} batch={batchSize} note="only last blocks partly empty" />
      </div>
    </div>
  );
}


export default function VllmPlayground() {
  const [batchSize, setBatchSize] = useState(32);
  const data = benchmarkData[batchSize];
  const transformersSpeedup = (data.vllm / data.transformers).toFixed(2);
  const generateSpeedup = (data.vllm / data.generate).toFixed(2);
  const maxThroughput = 900;

  return (
    <div className="min-w-0 space-y-6 rounded-3xl border border-accent-950/80 bg-[#0B0F1A]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-7">
      <div className="flex flex-col gap-4 border-b border-accent-950/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-accent-400">Interactive benchmark replay</span>
          <h3 className="text-lg font-bold text-white sm:text-xl">PagedAttention throughput, side by side</h3>
          <p className="max-w-2xl text-[11px] leading-relaxed text-slate-500">
            Recorded values from the unified Qwen2.5-1.5B-Instruct notebook suite on an NVIDIA Tesla T4. Select a batch size to compare the separate Hugging Face paths.
          </p>
        </div>
        <div className="w-fit rounded-xl border border-accent-500/30 bg-accent-500/10 px-3 py-2 font-mono text-xs text-accent-200">
          vLLM / Transformers <strong className="text-white">{transformersSpeedup}x</strong>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs font-mono text-slate-300">
          <label htmlFor="vllm-batch-size">Batch size</label>
          <span className="rounded-lg border border-accent-500/30 bg-[#0E1322] px-2.5 py-1 font-bold text-accent-400">BS = {batchSize}</span>
        </div>
        <input
          id="vllm-batch-size"
          type="range"
          min="0"
          max={batchSizes.length - 1}
          step="1"
          value={batchSizes.indexOf(batchSize)}
          onChange={(event) => setBatchSize(batchSizes[Number(event.target.value)])}
          className="h-2 w-full cursor-pointer accent-accent-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          {batchSizes.map((size) => (
            <button key={size} type="button" onClick={() => setBatchSize(size)} className={batchSize === size ? 'font-bold text-accent-400 underline' : 'transition-colors hover:text-accent-300'}>
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'vLLM · PagedAttention', value: data.vllm, color: 'from-accent-500 to-neon-500' },
          { label: 'HF Transformers', value: data.transformers, color: 'from-slate-500 to-slate-600' },
          { label: 'HF generate()', value: data.generate, color: 'from-violet-400 to-indigo-500' },
        ].map((metric) => (
          <div key={metric.label} className="space-y-3 rounded-2xl border border-accent-950/60 bg-[#06080F] p-4">
            <div className="text-[10px] font-mono uppercase tracking-wide text-slate-400">{metric.label}</div>
            <div className="font-mono text-xl font-bold text-white">{metric.value.toFixed(2)} <span className="text-xs font-normal text-slate-500">tok/s</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
              <motion.div className={`h-full rounded-full bg-gradient-to-r ${metric.color}`} animate={{ width: `${Math.min((metric.value / maxThroughput) * 100, 100)}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>
        ))}
      </div>

      <KvCacheVisual batchSize={batchSize} />

      <div className="grid grid-cols-1 gap-4 text-xs leading-relaxed text-slate-400 sm:grid-cols-2">
        <div className="rounded-2xl border border-accent-950/60 bg-[#06080F] p-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wide text-accent-300">At batch {batchSize}</div>
          <p>vLLM is <strong className="text-white">{transformersSpeedup}x</strong> the Transformers row and <strong className="text-white">{generateSpeedup}x</strong> the separate generate() row.</p>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wide text-amber-200">Read the result carefully</div>
          <p>These are notebook measurements, not a controlled serving benchmark. Runtime versions were not pinned and the recorded vLLM VRAM counter is missing, not zero.</p>
        </div>
      </div>
    </div>
  );
}
