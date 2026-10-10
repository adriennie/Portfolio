import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoraPlayground() {
  const [selectedRank, setSelectedRank] = useState(8);
  const [concurrentAdapters, setConcurrentAdapters] = useState(3);

  // Recorded notebook metrics for each LoRA rank.
  const rankData = {
    4:  { params: "0.54M", overhead: "0.0353%", trainingSeconds: "55.50", vramGB: "6.55", loss: "2.4458", description: "Recorded rank 4 adapter metrics from the training notebook." },
    8:  { params: "1.09M", overhead: "0.0705%", trainingSeconds: "47.83", vramGB: "4.76", loss: "2.4438", description: "Recorded rank 8 adapter metrics from the training notebook." },
    16: { params: "2.18M", overhead: "0.1410%", trainingSeconds: "48.55", vramGB: "4.77", loss: "2.4248", description: "Recorded rank 16 adapter metrics from the training notebook." }
  };

  const current = rankData[selectedRank];

  const totalParamsNum = (parseFloat(current.params) * concurrentAdapters).toFixed(2);

  return (
    <div className="min-w-0 p-4 sm:p-7 rounded-3xl border border-pink-950/80 bg-[#0B0F1A]/90 backdrop-blur-xl shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-950/60 pb-4">
        <div>
          <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block">Interactive PEFT Playground</span>
          <h3 className="text-lg sm:text-xl font-bold text-white">vLLM Multi-Adapter LoRA Routing Simulator</h3>
        </div>
        <div className="px-3 py-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 font-mono text-xs">
          Engine Mode: <strong className="text-white font-bold">Shared Base + LoraRequest</strong>
        </div>
      </div>
      <p className="-mt-2 text-[11px] leading-relaxed text-slate-500">
        Recorded training snapshot, not a live serving benchmark. It used four unique examples and training loss only; no held-out evaluation or serving benchmark was completed.
      </p>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Rank Selector */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300">
            <span>Adapter Rank ($r$):</span>
            <span className="text-pink-400 font-bold px-2.5 py-1 rounded-lg bg-[#0E1322] border border-pink-500/30">
              r = {selectedRank}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[4, 8, 16].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRank(r)}
                className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                  selectedRank === r 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-400 shadow-lg shadow-pink-500/20' 
                    : 'bg-[#06080F] text-slate-400 border-pink-950 hover:border-pink-500/40'
                }`}
              >
                Rank {r}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1">
            {current.description}
          </p>
        </div>

        {/* Concurrent Adapters Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300">
            <span>Active Concurrent Adapters:</span>
            <span className="text-pink-400 font-bold px-2.5 py-1 rounded-lg bg-[#0E1322] border border-pink-500/30">
              {concurrentAdapters} Adapters Loaded
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={concurrentAdapters}
            onChange={(e) => setConcurrentAdapters(parseInt(e.target.value))}
            className="w-full accent-pink-500 bg-slate-900 rounded-lg cursor-pointer h-2 mt-3"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <span key={num} className={concurrentAdapters === num ? 'text-pink-400 font-bold' : ''}>{num}x</span>
            ))}
          </div>
        </div>

      </div>

      {/* Derived parameter counts and evaluation status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        
        <div className="p-4 rounded-2xl bg-[#06080F] border border-pink-950/60 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Per-Adapter Parameters</div>
          <div className="text-lg font-bold font-mono text-white">{current.params}</div>
          <div className="text-[10px] font-mono text-pink-400">{current.overhead} of base model</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#06080F] border border-pink-950/60 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Aggregate Adapter Params</div>
          <div className="text-lg font-bold font-mono text-white">{totalParamsNum}M</div>
          <div className="text-[10px] font-mono text-pink-400">Derived across {concurrentAdapters} adapters</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#06080F] border border-pink-950/60 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Recorded Rank {selectedRank} Run</div>
          <div className="text-base sm:text-lg font-bold font-mono text-white">{current.trainingSeconds} s · {current.vramGB} GB</div>
          <div className="text-[10px] font-mono text-pink-400">Final loss {current.loss} · 4 examples</div>
        </div>

      </div>

    </div>
  );
}
