import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import ArchitectureFlow, { parseSteps } from './ArchitectureFlow.jsx';

// Desktop scrollytelling: the pipeline stays pinned on the left while each stage's
// explanation scrolls past on the right and lights up its node. Normal scrolling throughout;
// phones and tablets get the compact ArchitectureFlow instead.
export default function PipelineStory({ architecture }) {
  const reducedMotion = useReducedMotion();
  const steps = parseSteps(architecture);
  const heading = architecture.split('\n')[0].replace(/:$/, '');
  const [active, setActive] = useState(0);
  const storyRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start 60%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // The stage whose share of the scroll we're in is the active one.
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length))));
  });

  return (
    <>
      <div className="lg:hidden">
        <ArchitectureFlow architecture={architecture} />
      </div>

      <div ref={storyRef} className="hidden lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="col-span-5">
          <div className="sticky top-28 space-y-5 py-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{heading}</p>
            <ol className="relative space-y-3" aria-label={heading}>
              <span aria-hidden="true" className="absolute bottom-5 left-[17px] top-5 w-px bg-white/10" />
              <motion.span
                aria-hidden="true"
                className="absolute bottom-5 left-[17px] top-5 w-px origin-top bg-gradient-to-b from-accent-400 to-neon-400"
                style={{ scaleY: reducedMotion ? 1 : progress }}
              />
              {steps.map((step, index) => {
                const state = index === active ? 'active' : index < active ? 'done' : 'todo';
                return (
                  <li key={step.label} className="relative flex items-center gap-4">
                    <span className={`relative z-10 grid h-9 w-9 flex-none place-items-center rounded-full border font-mono text-[11px] transition-all duration-300 ${state === 'active' ? 'border-neon-400 bg-neon-500/20 text-white shadow-[0_0_20px_rgba(255,46,138,0.45)]' : state === 'done' ? 'border-accent-400/60 bg-accent-500/15 text-accent-200' : 'border-white/15 bg-[#05060d] text-slate-500'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-sm font-semibold transition-colors duration-300 ${state === 'active' ? 'text-white' : state === 'done' ? 'text-slate-300' : 'text-slate-500'}`}>{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <div className="col-span-7">
          {steps.map((step, index) => (
            <section key={step.label} data-step={index} className="flex min-h-[55vh] flex-col justify-center py-10 first:min-h-[40vh] last:min-h-[45vh]" aria-label={step.label}>
              <motion.div
                initial={reducedMotion ? false : { opacity: 0.25, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.6 }}
                transition={{ duration: 0.45 }}
                className="space-y-3"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-300">Stage {String(index + 1).padStart(2, '0')}</p>
                <h3 className="font-display text-4xl font-semibold tracking-[-0.02em] text-white">{step.label}</h3>
                <p className="max-w-xl text-lg leading-relaxed text-slate-300">{step.detail}</p>
              </motion.div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
