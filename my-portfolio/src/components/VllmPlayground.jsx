import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function VllmPlayground() {
  const [batchSize, setBatchSize] = useState(16);

  // Recorded result table from the Tesla T4 notebook comparison.
  // Batch sizes: 1, 2, 4, 8, 16, 32
  const benchmarkData = {
    1:  { hfTok: 18.77,  vllmTok: 30.05 },
    2:  { hfTok: 18.19,  vllmTok: 50.13 },
    4:  { hfTok: 36.04, vllmTok: 116.06 },
    8:  { hfTok: 61.42,  vllmTok: 226.98 },
    16: { hfTok: 107.00, vllmTok: 270.61 },
    32: { hfTok: 173.45, vllmTok: 877.69 }
  };

  // Find closest matching key for slider steps
  const validBatchSizes = [1, 2, 4, 8, 16, 32];
  const currentBatch = validBatchSizes.reduce((prev, curr) => 
    Math.abs(curr - batchSize) < Math.abs(prev - batchSize) ? curr : prev
  );

  const data = benchmarkData[currentBatch];
  const speedup = typeof data.hfTok === 'number' ? (data.vllmTok / data.hfTok).toFixed(2) : "5.06";

  return (
    <div className="min-w-0 p-4 sm:p-7 rounded-3xl border border-pink-950/80 bg-[#0B0F1A]/90 backdrop-blur-xl shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-950/60 pb-4">
        <div>
          <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block">Interactive Playground</span>
          <h3 className="text-lg sm:text-xl font-bold text-white">vLLM PagedAttention vs. Hugging Face Throughput</h3>
        </div>
        <div className="px-3 py-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 font-mono text-xs">
          Speedup: <strong className="text-white font-bold">{speedup}x</strong>
        </div>
      </div>
      <p className="-mt-2 text-[11px] leading-relaxed text-slate-500">
        Recorded throughput snapshot, not a live model server. At batch 32, vLLM is 5.06x the Transformers row (173.45 tok/s) and 1.43x a separate Hugging Face generate() row (613.65 tok/s). Runtime versions were not pinned.
      </p>

      {/* Slider Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-mono text-slate-300">
          <span>Batch Size Configuration:</span>
          <span className="text-pink-400 font-bold px-2.5 py-1 rounded-lg bg-[#0E1322] border border-pink-500/30">
            BS = {currentBatch}
          </span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="32" 
          value={batchSize}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            // Snap to nearest valid batch size
            const closest = validBatchSizes.reduce((prev, curr) => 
              Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
            );
            setBatchSize(closest);
          }}
          className="w-full accent-pink-500 bg-slate-900 rounded-lg cursor-pointer h-2"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          {validBatchSizes.map((b) => (
            <button 
              key={b} 
              onClick={() => setBatchSize(b)}
              className={`hover:text-pink-400 transition-colors ${currentBatch === b ? 'text-pink-400 font-bold underline' : ''}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Throughput Card */}
        <div className="p-5 rounded-2xl bg-[#06080F] border border-pink-950/60 space-y-3">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Generation Throughput</div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-pink-400">vLLM (PagedAttention):</span>
              <span className="text-white font-bold">{data.vllmTok} tok/s</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                animate={{ width: `${(data.vllmTok / 900) * 100}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-400">Hugging Face Baseline:</span>
              <span className="text-slate-300">{data.hfTok} tok/s</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
              <motion.div 
                className="h-full bg-slate-600 rounded-full"
                animate={{ width: `${(data.hfTok / 900) * 100}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </div>
        </div>

        {/* Measurement Notes Card */}
        <div className="p-5 rounded-2xl bg-[#06080F] border border-pink-950/60 space-y-3">
          <div className="text-[11px] font-mono text-slate-400 uppercase">What this replay shows</div>
          <div className="space-y-3 pt-1 text-xs leading-relaxed text-slate-400">
            <p>Throughput values from the recorded Tesla T4 benchmark across batch sizes 1, 2, 4, 8, 16, and 32.</p>
            <p>The vLLM allocator reports 0.0 VRAM, which means memory was not captured, not that it used zero memory. Treat these as notebook results, not a controlled cross-runtime comparison.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
