import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { projects } from '../data/projects.js';
import ProjectCard, { transitionNames } from './ProjectCard.jsx';
import ProjectEvidence from './ProjectEvidence.jsx';
import { Magnetic, TiltSurface } from './MotionKit.jsx';

const BASE_URL = `${import.meta.env.BASE_URL}/`;

const FILTERS = [
  { id: 'all', en: 'All work', de: 'Alle Projekte' },
  { id: 'llm', en: 'LLM systems', de: 'LLM-Systeme' },
  { id: 'ml', en: 'Applied ML', de: 'Angewandtes ML' },
  { id: 'products', en: 'Products', de: 'Produkte' },
];

const pick = (field, language) => (field ? field[language] ?? field.en : '');

// Desktop / iPad: one large editorial row per flagship project, alternating sides.
function Showcase({ project, index, language }) {
  // Scroll-linked depth: the evidence panel rises and settles as the row crosses the screen,
  // and the large index number drifts at a different speed.
  const reducedMotion = useReducedMotion();
  const rowRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start end', 'end start'] });
  const panelY = useTransform(scrollYProgress, [0, 0.45, 1], [90, 0, -40]);
  const panelScale = useTransform(scrollYProgress, [0, 0.45], [0.9, 1]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.3], [0.2, 1]);
  const numberY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const { card } = project;
  const names = transitionNames(project.id);
  const flipped = index % 2 === 1;
  const href = `${BASE_URL}projects/${project.id}`;

  return (
    <article ref={rowRef} className="group grid grid-cols-1 items-center gap-8 border-t border-white/10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
      <div className={`min-w-0 space-y-5 lg:col-span-5 ${flipped ? 'lg:order-2' : ''}`}>
        <div className="flex items-center gap-4">
          <motion.span style={reducedMotion ? undefined : { y: numberY }} className="font-display text-6xl font-semibold leading-none text-white/10 lg:text-7xl" aria-hidden="true">{String(index + 1).padStart(2, '0')}</motion.span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-400 md:[view-transition-name:var(--vt)]" style={{ '--vt': names.kicker }}>{pick(card.kicker, language)}</span>
        </div>
        <h3 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-white">
          <span className="md:[view-transition-name:var(--vt)]" style={{ '--vt': names.title }}>{card.title || project.title}</span>
        </h3>
        <p className="max-w-xl text-sm leading-relaxed text-slate-300 lg:text-base">{pick(card.summary, language)}</p>
        <div className="flex flex-wrap gap-2">
          {card.chips.map((chip) => <span key={chip} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-slate-300">{chip}</span>)}
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Magnetic>
            <a href={href} className="tactile inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 font-mono text-xs font-bold text-[#09090F] transition-colors hover:bg-accent-200">
              {language === 'de' ? 'Fallstudie öffnen' : 'Open case study'} <span aria-hidden="true">→</span>
            </a>
          </Magnetic>
          {project.video && (
            <a href={`https://youtu.be/${project.video.youtubeId}`} target="_blank" rel="noreferrer" className="tactile inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 font-mono text-xs text-slate-200 transition-colors hover:border-accent-400/50 hover:text-white">
              ▶ {language === 'de' ? 'Demo' : 'Watch demo'}
            </a>
          )}
        </div>
      </div>
      <div className={`min-w-0 lg:col-span-7 ${flipped ? 'lg:order-1' : ''}`}>
        <motion.div style={reducedMotion ? undefined : { y: panelY, scale: panelScale, opacity: panelOpacity }}>
        <TiltSurface className="rounded-3xl">
          <div className="block rounded-3xl border border-white/10 bg-gradient-to-br from-[#15131c] via-[#0d0d14] to-[#0a0a10] p-6 shadow-2xl shadow-black/40 transition-colors group-hover:border-accent-400/30 sm:p-8">
            <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <span>{language === 'de' ? 'Belege' : 'Evidence'}</span>
              {card.badge && <span className="normal-case tracking-normal text-neon-300">{card.badge}</span>}
            </div>
            <ProjectEvidence project={project} />
          </div>
        </TiltSurface>
        </motion.div>
      </div>
    </article>
  );
}

// Phones: a swipeable stack with pagination and buttons, so nothing depends on the gesture.
function MobileStack({ items, language }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(Number(entry.target.dataset.index)); });
    }, { root: track, threshold: 0.6 });
    track.querySelectorAll('[data-index]').forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => setActive(0), [items.map((item) => item.id).join()]);

  const goTo = (index) => {
    const slide = trackRef.current?.querySelector(`[data-index="${index}"]`);
    slide?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
  };

  if (!items.length) return null;
  return (
    <div className="space-y-4">
      <div ref={trackRef} className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none]" aria-roledescription="carousel" aria-label={language === 'de' ? 'Projekte' : 'Projects'}>
        {items.map((project, index) => {
          const names = transitionNames(project.id);
          const href = `${BASE_URL}projects/${project.id}`;
          return (
            <article key={project.id} data-index={index} aria-roledescription="slide" aria-label={`${index + 1} / ${items.length}`} className="w-[86%] flex-none snap-start">
              <a href={href} className="tactile flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-[#15131c] to-[#0a0a10] p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-400 max-md:[view-transition-name:var(--vt)]" style={{ '--vt': names.kicker }}>{pick(project.card.kicker, language)}</span>
                <h3 className="font-display text-3xl font-semibold leading-[1.02] tracking-[-0.02em] text-white">
                  <span className="max-md:[view-transition-name:var(--vt)]" style={{ '--vt': names.title }}>{project.card.title || project.title}</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">{pick(project.card.summary, language)}</p>
                <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="font-mono text-xl font-bold text-white">{project.stats[0].value}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{project.stats[0].label}</p>
                </div>
                <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-white font-mono text-xs font-bold text-[#09090F]">{language === 'de' ? 'Fallstudie öffnen →' : 'Open case study →'}</span>
              </a>
            </article>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => goTo(Math.max(0, active - 1))} disabled={active === 0} aria-label={language === 'de' ? 'Vorheriges Projekt' : 'Previous project'} className="tactile grid h-11 w-11 place-items-center rounded-full border border-white/15 text-slate-200 disabled:opacity-30">←</button>
        <div className="flex gap-2" role="tablist" aria-label={language === 'de' ? 'Projekt wählen' : 'Choose project'}>
          {items.map((project, index) => (
            <button key={project.id} type="button" role="tab" aria-selected={active === index} aria-label={project.card.title || project.title} onClick={() => goTo(index)} className="grid h-11 w-6 place-items-center">
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${active === index ? 'w-5 bg-accent-400' : 'w-1.5 bg-white/25'}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => goTo(Math.min(items.length - 1, active + 1))} disabled={active === items.length - 1} aria-label={language === 'de' ? 'Nächstes Projekt' : 'Next project'} className="tactile grid h-11 w-11 place-items-center rounded-full border border-white/15 text-slate-200 disabled:opacity-30">→</button>
      </div>
    </div>
  );
}

export default function ProjectShowcase({ language }) {
  const [filter, setFilter] = useState('all');
  const reducedMotion = useReducedMotion();
  const matches = (project) => filter === 'all' || project.card.categories?.includes(filter);
  const flagship = projects.filter((project) => project.card.shelf === 'featured' && matches(project));
  const more = projects.filter((project) => project.card.shelf === 'more' && matches(project));
  const counts = Object.fromEntries(FILTERS.map((item) => [item.id, projects.filter((project) => item.id === 'all' || project.card.categories?.includes(item.id)).length]));

  return (
    <div className="space-y-6">
      <LayoutGroup id="project-filters">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="group" aria-label={language === 'de' ? 'Projekte filtern' : 'Filter projects'}>
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`tactile relative min-h-11 flex-none rounded-full px-4 font-mono text-xs transition-colors ${filter === item.id ? 'text-[#09090F]' : 'text-slate-300 hover:text-white'}`}
            >
              {filter === item.id && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-white" transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="relative">{pick(item, language)} <span className="opacity-50">{counts[item.id]}</span></span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <div className="md:hidden">
        <MobileStack items={[...flagship, ...more]} language={language} />
      </div>

      <div className="hidden md:block">
        <AnimatePresence mode="popLayout" initial={false}>
          {flagship.map((project, index) => (
            <motion.div
              key={project.id}
              layout={!reducedMotion}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <Showcase project={project} index={index} language={language} />
            </motion.div>
          ))}
        </AnimatePresence>

        {more.length > 0 && (
          <div className="space-y-6 border-t border-white/10 pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">{language === 'de' ? 'Weitere Arbeiten' : 'More work'}</p>
            <motion.div layout={!reducedMotion} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {more.map((project) => (
                  <motion.div key={project.id} layout={!reducedMotion} initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
                    <ProjectCard project={project} language={language} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
