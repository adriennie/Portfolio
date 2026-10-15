import React, { useState } from 'react';
import { motion } from 'framer-motion';

const benchmarkData = {
  1: { transformers: 18.77, vllm: 30.05, generate: 19.72 },
  2: { transformers: 18.19, vllm: 50.13, generate: 42.87 },
  4: { transformers: 36.04, vllm: 116.06, generate: 83.91 },
  8: { transformers: 61.42, vllm: 226.98, generate: 163.31 },
  16: { transformers: 107.00, vllm: 270.61, generate: 325.02 },
  32: { transformers: 173.45, vllm: 877.69, generate: 613.65 },
};

const batchSizes = Object.keys(benchmarkData).map(Number);

export default function VllmPlayground() {
  const [batchSize, setBatchSize] = useState(32);
  const data = benchmarkData[batchSize];
  const transformersSpeedup = (data.vllm / data.transformers).toFixed(2);
  const generateSpeedup = (data.vllm / data.generate).toFixed(2);
  const maxThroughput = 900;

  return (
    <div className="min-w-0 space-y-6 rounded-3xl border border-pink-950/80 bg-[#0B0F1A]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-7">
      <div className="flex flex-col gap-4 border-b border-pink-950/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-pink-400">Interactive benchmark replay</span>
          <h3 className="text-lg font-bold text-white sm:text-xl">PagedAttention throughput, side by side</h3>
          <p className="max-w-2xl text-[11px] leading-relaxed text-slate-500">
            Recorded values from the unified Qwen2.5-1.5B-Instruct notebook suite on an NVIDIA Tesla T4. Select a batch size to compare the separate Hugging Face paths.
          </p>
        </div>
        <div className="w-fit rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-2 font-mono text-xs text-pink-200">
          vLLM / Transformers <strong className="text-white">{transformersSpeedup}x</strong>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs font-mono text-slate-300">
          <label htmlFor="vllm-batch-size">Batch size</label>
          <span className="rounded-lg border border-pink-500/30 bg-[#0E1322] px-2.5 py-1 font-bold text-pink-400">BS = {batchSize}</span>
        </div>
        <input
          id="vllm-batch-size"
          type="range"
          min="0"
          max={batchSizes.length - 1}
          step="1"
          value={batchSizes.indexOf(batchSize)}
          onChange={(event) => setBatchSize(batchSizes[Number(event.target.value)])}
          className="h-2 w-full cursor-pointer accent-pink-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          {batchSizes.map((size) => (
            <button key={size} type="button" onClick={() => setBatchSize(size)} className={batchSize === size ? 'font-bold text-pink-400 underline' : 'transition-colors hover:text-pink-300'}>
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'vLLM · PagedAttention', value: data.vllm, color: 'from-pink-500 to-rose-500' },
          { label: 'HF Transformers', value: data.transformers, color: 'from-slate-500 to-slate-600' },
          { label: 'HF generate()', value: data.generate, color: 'from-violet-400 to-indigo-500' },
        ].map((metric) => (
          <div key={metric.label} className="space-y-3 rounded-2xl border border-pink-950/60 bg-[#06080F] p-4">
            <div className="text-[10px] font-mono uppercase tracking-wide text-slate-400">{metric.label}</div>
            <div className="font-mono text-xl font-bold text-white">{metric.value.toFixed(2)} <span className="text-xs font-normal text-slate-500">tok/s</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
              <motion.div className={`h-full rounded-full bg-gradient-to-r ${metric.color}`} animate={{ width: `${Math.min((metric.value / maxThroughput) * 100, 100)}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 text-xs leading-relaxed text-slate-400 sm:grid-cols-2">
        <div className="rounded-2xl border border-pink-950/60 bg-[#06080F] p-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wide text-pink-300">At batch {batchSize}</div>
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
