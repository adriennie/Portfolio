import React, { useState } from 'react';
import { motion } from 'framer-motion';

const rankData = {
  4: { params: 544768, overhead: '0.0353%', trainingSeconds: 55.50, vramGB: 6.55, loss: 2.4458 },
  8: { params: 1089536, overhead: '0.0705%', trainingSeconds: 47.83, vramGB: 4.76, loss: 2.4438 },
  16: { params: 2179072, overhead: '0.1410%', trainingSeconds: 48.55, vramGB: 4.77, loss: 2.4248 },
};

const ranks = Object.keys(rankData).map(Number);

export default function LoraPlayground() {
  const [selectedRank, setSelectedRank] = useState(8);
  const [concurrentAdapters, setConcurrentAdapters] = useState(3);
  const current = rankData[selectedRank];
  const aggregateParams = ((current.params * concurrentAdapters) / 1000000).toFixed(2);

  return (
    <div className="min-w-0 space-y-6 rounded-3xl border border-pink-950/80 bg-[#0B0F1A]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-7">
      <div className="flex flex-col gap-4 border-b border-pink-950/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-pink-400">Interactive PEFT replay</span>
          <h3 className="text-lg font-bold text-white sm:text-xl">Rank ablation → shared-engine routing</h3>
          <p className="max-w-2xl text-[11px] leading-relaxed text-slate-500">
            Recorded Qwen2.5-1.5B-Instruct training metrics for three LoRA ranks, paired with the repository&apos;s LoraRequest serving demonstration.
          </p>
        </div>
        <div className="w-fit rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-2 font-mono text-xs text-pink-200">
          {concurrentAdapters} adapters · <strong className="text-white">1 base engine</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>LoRA rank</span>
            <span className="rounded-lg border border-pink-500/30 bg-[#0E1322] px-2.5 py-1 font-bold text-pink-400">r = {selectedRank}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ranks.map((rank) => (
              <button key={rank} type="button" onClick={() => setSelectedRank(rank)} className={`rounded-xl border py-2 text-xs font-mono font-bold transition-all ${selectedRank === rank ? 'border-pink-400 bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20' : 'border-pink-950 bg-[#06080F] text-slate-400 hover:border-pink-500/40'}`}>
                Rank {rank}
              </button>
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">Trainable q_proj and v_proj updates on a frozen base model. The notebook repeats four unique examples 25 times.</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <label htmlFor="lora-adapter-count">Adapters routed through one engine</label>
            <span className="rounded-lg border border-pink-500/30 bg-[#0E1322] px-2.5 py-1 font-bold text-pink-400">{concurrentAdapters}x</span>
          </div>
          <input id="lora-adapter-count" type="range" min="1" max="5" step="1" value={concurrentAdapters} onChange={(event) => setConcurrentAdapters(Number(event.target.value))} className="mt-3 h-2 w-full cursor-pointer accent-pink-500" />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            {[1, 2, 3, 4, 5].map((count) => <button key={count} type="button" onClick={() => setConcurrentAdapters(count)} className={concurrentAdapters === count ? 'font-bold text-pink-400' : 'transition-colors hover:text-pink-300'}>{count}x</button>)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-pink-950/60 bg-[#06080F] p-4">
          <div className="text-[10px] font-mono uppercase tracking-wide text-slate-400">Trainable parameters</div>
          <div className="mt-2 font-mono text-lg font-bold text-white">{current.params.toLocaleString()}</div>
          <div className="mt-1 text-[10px] font-mono text-pink-400">{current.overhead} of base model</div>
        </div>
        <div className="rounded-2xl border border-pink-950/60 bg-[#06080F] p-4">
          <div className="text-[10px] font-mono uppercase tracking-wide text-slate-400">Loaded adapter footprint</div>
          <div className="mt-2 font-mono text-lg font-bold text-white">{aggregateParams}M</div>
          <div className="mt-1 text-[10px] font-mono text-pink-400">Derived for {concurrentAdapters} routed adapters</div>
        </div>
        <div className="rounded-2xl border border-pink-950/60 bg-[#06080F] p-4">
          <div className="text-[10px] font-mono uppercase tracking-wide text-slate-400">Recorded rank {selectedRank}</div>
          <div className="mt-2 font-mono text-lg font-bold text-white">{current.trainingSeconds.toFixed(2)}s · {current.vramGB.toFixed(2)} GB</div>
          <div className="mt-1 text-[10px] font-mono text-pink-400">Training loss {current.loss.toFixed(4)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 text-xs leading-relaxed text-slate-400 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-pink-950/60 bg-[#06080F] p-4">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-wide text-pink-300">Routing state</div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
            <span className="rounded-lg border border-pink-400/30 bg-pink-400/10 px-2 py-1">Qwen base</span>
            <span className="text-pink-400">→</span>
            <motion.span key={concurrentAdapters} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1">{concurrentAdapters} LoraRequest handles</motion.span>
            <span className="text-pink-400">→</span>
            <span className="rounded-lg border border-pink-400/30 bg-pink-400/10 px-2 py-1">vLLM engine</span>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wide text-amber-200">Evaluation boundary</div>
          <p>Training loss and one-prompt outputs do not establish generalization, factuality, or a best rank. Serving throughput was not benchmarked.</p>
        </div>
      </div>
    </div>
  );
}
