import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

// A pink line draws down the timeline as it scrolls past; each milestone lights up on arrival.
export default function CareerTimeline({ events, heading }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="space-y-8 pt-8">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">{heading}</h3>
      <div ref={ref} className="relative max-w-4xl">
        <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10" />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-accent-400 to-neon-500 shadow-[0_0_12px_rgba(94,143,255,0.6)]"
          style={{ scaleY: reducedMotion ? 1 : drawn }}
        />
        <ol className="space-y-6">
          {events.map((event, index) => (
            <motion.li
              key={event.title}
              className="relative pl-10 sm:pl-14"
              initial={reducedMotion ? false : 'dim'}
              whileInView="lit"
              viewport={{ once: true, amount: 0.6 }}
              variants={{ dim: { opacity: 0.35, x: 12 }, lit: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-6 flex h-4 w-4 items-center justify-center rounded-full border border-accent-300/60 bg-[#09090F]"
                variants={{ dim: { boxShadow: '0 0 0 rgba(94,143,255,0)' }, lit: { boxShadow: '0 0 18px rgba(94,143,255,0.7)' } }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              </motion.span>
              <article className="rounded-3xl border border-white/10 bg-[#0d0d14]/80 p-5 sm:p-6">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="w-fit rounded-full bg-accent-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent-300">{event.type}</span>
                  <span className="font-mono text-xs text-slate-400">{event.period}</span>
                </div>
                <h4 className="font-display text-xl font-semibold text-white sm:text-2xl">{event.title}</h4>
                <p className="mt-1 font-mono text-xs text-slate-400">{event.organization}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{event.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.highlights.map((highlight) => (
                    <span key={highlight} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-slate-300">{highlight}</span>
                  ))}
                </div>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
