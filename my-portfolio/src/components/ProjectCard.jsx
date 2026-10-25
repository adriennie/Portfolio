import React from 'react';
import { CountUp } from './MotionKit.jsx';

const BASE_URL = `${import.meta.env.BASE_URL}/`;

// Names shared with projects/[id].astro so the browser morphs card → case study.
export const transitionNames = (id) => ({
  title: `project-title-${id}`,
  kicker: `project-kicker-${id}`,
});

const chipClass = 'px-2 py-0.5 rounded bg-[#0E1322] border border-accent-500/20';
const ctaClass = 'block text-center rounded-xl py-2.5 text-xs font-mono font-bold bg-accent-500/10 text-accent-300 border border-accent-400/30 hover:bg-accent-500/20 hover:text-white transition-all';

export default function ProjectCard({ project, language }) {
  const { card } = project;
  const t = (field) => (field ? field[language] ?? field.en : '');
  const names = transitionNames(project.id);
  const title = card.title || project.title;
  const href = `${BASE_URL}projects/${project.id}`;
  const cta = card.cta ? t(card.cta) : language === 'de' ? 'Details & Architektur ansehen ↗' : 'View Details & Architecture ↗';
  const TitleTag = card.shelf === 'more' ? 'h4' : 'h3';

  const kicker = (
    <span className="text-[10px] font-mono text-accent-400 uppercase tracking-widest md:[view-transition-name:var(--vt)]" style={{ '--vt': names.kicker }}>
      {t(card.kicker)}
    </span>
  );
  const badge = card.badge && (
    <span className="rounded-full border border-accent-400/30 bg-accent-400/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-accent-300">{card.badge}</span>
  );
  const chips = (
    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-accent-300 min-h-[1.75rem] items-center">
      {card.chips.map((chip) => <span key={chip} className={chipClass}>{chip}</span>)}
    </div>
  );

  if (card.wide) {
    return (
      <article className="group md:col-span-2 rounded-3xl border border-accent-500/30 bg-gradient-to-br from-[#140b16] via-[#0B0F1A] to-[#0B0F1A] p-6 sm:p-7 backdrop-blur-xl hover:border-accent-400/60 shadow-2xl transition-all hover:-translate-y-1">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">{kicker}{badge}</div>
            <TitleTag className="text-2xl font-bold text-white group-hover:text-accent-300 transition-colors">
              <span className="md:[view-transition-name:var(--vt)]" style={{ '--vt': names.title }}>{title}</span>
            </TitleTag>
            <p className="text-sm text-slate-300 leading-relaxed">{t(card.summary)}</p>
            {chips}
          </div>
          <div className="space-y-4">
            {card.tiles && (
              <dl className="grid grid-cols-3 gap-2 text-center">
                {card.tiles.map((tile) => (
                  <div key={tile.value} className="flex flex-col-reverse rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-3">
                    <dt className="mt-1 text-[10px] leading-tight text-slate-400">{t(tile)}</dt>
                    <dd className="text-lg font-extrabold text-white font-mono"><CountUp value={tile.value} /></dd>
                  </div>
                ))}
              </dl>
            )}
            <div className={`grid gap-2 ${project.video ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <a href={href} className={ctaClass}>{cta}</a>
              {project.video && (
                <a href={`https://youtu.be/${project.video.youtubeId}`} target="_blank" rel="noreferrer" className="block text-center py-2.5 rounded-xl text-xs font-mono font-bold bg-[#0E1322] text-slate-200 border border-white/10 hover:border-accent-400/40 hover:text-white transition-all">
                  ▶ {language === 'de' ? 'Demo ansehen' : 'Watch demo'}
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group rounded-3xl border border-accent-500/20 bg-[#0B0F1A]/80 p-6 backdrop-blur-xl hover:border-accent-400/50 flex flex-col justify-between shadow-2xl transition-all hover:-translate-y-1 h-full">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 min-h-[1.75rem]">{kicker}{badge}</div>
        <TitleTag className="text-xl font-bold text-white group-hover:text-accent-300 transition-colors min-h-[3.5rem] flex items-start">
          <span className="md:[view-transition-name:var(--vt)]" style={{ '--vt': names.title }}>{title}</span>
        </TitleTag>
        <p className="text-xs text-slate-300 leading-relaxed min-h-[3.75rem] sm:min-h-[4rem]">{t(card.summary)}</p>
      </div>
      <div className="pt-6 space-y-4 mt-auto">
        {chips}
        <a href={href} className={`${ctaClass} w-full`}>{cta}</a>
      </div>
    </article>
  );
}
