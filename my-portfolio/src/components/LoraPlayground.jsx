import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const rankData = {
  4: { params: 544768, overhead: '0.0353%', trainingSeconds: 55.50, vramGB: 6.55, loss: 2.4458 },
  8: { params: 1089536, overhead: '0.0705%', trainingSeconds: 47.83, vramGB: 4.76, loss: 2.4438 },
  16: { params: 2179072, overhead: '0.1410%', trainingSeconds: 48.55, vramGB: 4.77, loss: 2.4248 },
};

const ranks = Object.keys(rankData).map(Number);

// Qwen2.5-1.5B shapes: hidden 1536, v_proj output 256 (grouped-query attention), 28 decoder layers.
const HIDDEN = 1536;
const V_OUT = 256;
const LAYERS = 28;
const ADAPTER_COLORS = { 4: 'bg-sky-400', 8: 'bg-accent-400', 16: 'bg-amber-300' };

function LowRankSketch({ rank }) {
  const thickness = rank * 1.5;
  const perLayerQ = rank * (HIDDEN + HIDDEN);
  const perLayerV = rank * (HIDDEN + V_OUT);
  return (
    <div className="rounded-2xl border border-accent-950/60 bg-[#06080F] p-4">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-wide text-accent-300">W′ = W + B·A on q_proj and v_proj</div>
      <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] text-slate-400" aria-hidden="true">
        <div className="flex flex-col items-center gap-1">
          <div className="grid h-24 w-24 place-items-center rounded-md border border-slate-600 bg-slate-800/60 text-slate-500">W</div>
          <span>1536 × 1536 · frozen</span>
        </div>
        <span className="text-lg text-accent-300">+</span>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <motion.div className="grid h-24 place-items-center rounded-sm bg-accent-500/70 text-[9px] text-white" animate={{ width: thickness }} transition={{ type: 'spring', stiffness: 220, damping: 22 }} />
            <span>B</span>
          </div>
          <span className="text-slate-500">·</span>
          <div className="flex flex-col items-center gap-1">
            <motion.div className="w-24 rounded-sm bg-neon-400/70" animate={{ height: thickness }} transition={{ type: 'spring', stiffness: 220, damping: 22 }} />
            <span>A</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] leading-relaxed text-slate-400">
        {LAYERS} layers × ({perLayerQ.toLocaleString()} q + {perLayerV.toLocaleString()} v) = <strong className="text-white">{(LAYERS * (perLayerQ + perLayerV)).toLocaleString()}</strong> trainable parameters at r = {rank}
      </p>
    </div>
  );
}

function RoutingFlow({ adapters }) {
  const reducedMotion = useReducedMotion();
  const lanes = [4, 8, 16, 4, 8].slice(0, adapters);
  return (
    <div className="rounded-2xl border border-accent-950/60 bg-[#06080F] p-4">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-wide text-accent-300">Routing · one engine, {adapters} LoraRequest handle{adapters > 1 ? 's' : ''}</div>
      <div className="flex items-stretch gap-3">
        <div className="relative min-w-0 flex-1 space-y-2 overflow-hidden" aria-hidden="true">
          {lanes.map((rank, lane) => (
            <div key={lane} className="relative h-4 rounded-full bg-slate-900">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[9px] text-slate-500">r={rank}</span>
              {!reducedMotion && [0, 1].map((dot) => (
                <motion.span
                  key={dot}
                  className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${ADAPTER_COLORS[rank]}`}
                  initial={{ left: '18%', opacity: 0 }}
                  animate={{ left: ['18%', '96%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: lane * 0.35 + dot * 0.9, ease: 'easeInOut' }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex w-28 flex-none flex-col justify-center rounded-xl border border-accent-400/30 bg-accent-400/10 p-2 text-center font-mono text-[10px] text-accent-100">
          <span className="font-bold text-white">vLLM engine</span>
          <span className="text-accent-200/80">one Qwen base</span>
        </div>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-slate-500">Each request names its adapter; the engine applies that adapter&apos;s B·A on top of the shared base weights instead of loading a separate model.</p>
    </div>
  );
}


export default function LoraPlayground() {
  const [selectedRank, setSelectedRank] = useState(8);
  const [concurrentAdapters, setConcurrentAdapters] = useState(3);
  const current = rankData[selectedRank];
  const aggregateParams = ((current.params * concurrentAdapters) / 1000000).toFixed(2);

  return (
    <div className="min-w-0 space-y-6 rounded-3xl border border-accent-950/80 bg-[#0B0F1A]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-7">
      <div className="flex flex-col gap-4 border-b border-accent-950/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-accent-400">Interactive PEFT replay</span>
          <h3 className="text-lg font-bold text-white sm:text-xl">Rank ablation → shared-engine routing</h3>
          <p className="max-w-2xl text-[11px] leading-relaxed text-slate-500">
            Recorded Qwen2.5-1.5B-Instruct training metrics for three LoRA ranks, paired with the repository&apos;s LoraRequest serving demonstration.
          </p>
        </div>
        <div className="w-fit rounded-xl border border-accent-500/30 bg-accent-500/10 px-3 py-2 font-mono text-xs text-accent-200">
          {concurrentAdapters} adapters · <strong className="text-white">1 base engine</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>LoRA rank</span>
            <span className="rounded-lg border border-accent-500/30 bg-[#0E1322] px-2.5 py-1 font-bold text-accent-400">r = {selectedRank}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ranks.map((rank) => (
              <button key={rank} type="button" onClick={() => setSelectedRank(rank)} className={`rounded-xl border py-2 text-xs font-mono font-bold transition-all ${selectedRank === rank ? 'border-accent-400 bg-gradient-to-r from-accent-500 to-neon-600 text-white shadow-lg shadow-accent-500/20' : 'border-accent-950 bg-[#06080F] text-slate-400 hover:border-accent-500/40'}`}>
                Rank {rank}
              </button>
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">Trainable q_proj and v_proj updates on a frozen base model. The notebook repeats four unique examples 25 times.</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <label htmlFor="lora-adapter-count">Adapters routed through one engine</label>
            <span className="rounded-lg border border-accent-500/30 bg-[#0E1322] px-2.5 py-1 font-bold text-accent-400">{concurrentAdapters}x</span>
          </div>
          <input id="lora-adapter-count" type="range" min="1" max="5" step="1" value={concurrentAdapters} onChange={(event) => setConcurrentAdapters(Number(event.target.value))} className="mt-3 h-2 w-full cursor-pointer accent-accent-500" />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            {[1, 2, 3, 4, 5].map((count) => <button key={count} type="button" onClick={() => setConcurrentAdapters(count)} className={concurrentAdapters === count ? 'font-bold text-accent-400' : 'transition-colors hover:text-accent-300'}>{count}x</button>)}
          </div>
        </div>
      </div>

      <LowRankSketch rank={selectedRank} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-accent-950/60 bg-[#06080F] p-4">
          <div className="text-[10px] font-mono uppercase tracking-wide text-slate-400">Trainable parameters</div>
          <div className="mt-2 font-mono text-lg font-bold text-white">{current.params.toLocaleString()}</div>
          <div className="mt-1 text-[10px] font-mono text-accent-400">{current.overhead} of base model</div>
        </div>
        <div className="rounded-2xl border border-accent-950/60 bg-[#06080F] p-4">
          <div className="text-[10px] font-mono uppercase tracking-wide text-slate-400">Loaded adapter footprint</div>
          <div className="mt-2 font-mono text-lg font-bold text-white">{aggregateParams}M</div>
          <div className="mt-1 text-[10px] font-mono text-accent-400">Derived for {concurrentAdapters} routed adapters</div>
        </div>
        <div className="rounded-2xl border border-accent-950/60 bg-[#06080F] p-4">
          <div className="text-[10px] font-mono uppercase tracking-wide text-slate-400">Recorded rank {selectedRank}</div>
          <div className="mt-2 font-mono text-lg font-bold text-white">{current.trainingSeconds.toFixed(2)}s · {current.vramGB.toFixed(2)} GB</div>
          <div className="mt-1 text-[10px] font-mono text-accent-400">Training loss {current.loss.toFixed(4)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 text-xs leading-relaxed text-slate-400 sm:grid-cols-[1.15fr_0.85fr]">
        <RoutingFlow adapters={concurrentAdapters} />
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wide text-amber-200">Evaluation boundary</div>
          <p>Training loss and one-prompt outputs do not establish generalization, factuality, or a best rank. Serving throughput was not benchmarked.</p>
        </div>
      </div>
    </div>
  );
}
