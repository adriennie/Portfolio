import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { projects } from '../data/projects.js';

const BASE_URL = `${import.meta.env.BASE_URL}/`;

// Which portfolio projects show each skill. Skills used only outside these projects say where instead.
const SKILL_GROUPS = [
  { name: { en: 'Programming', de: 'Programmierung' }, skills: [
    { name: 'Python', projects: ['sib-doc', 'log-triage', 'vllm-pagedattention-benchmark', 'vllm-lora-extension', 'astronomical-image-processing'] },
    { name: 'SQL', projects: ['swasthya', 'ecoshare'] },
    { name: 'TypeScript', projects: ['swasthya', 'ecoshare'] },
    { name: 'Java', note: { en: 'Coursework (B.Tech, UPES)', de: 'Studium (B.Tech, UPES)' } },
  ] },
  { name: { en: 'Machine Learning', de: 'Maschinelles Lernen' }, skills: [
    { name: 'PyTorch', projects: ['vllm-pagedattention-benchmark', 'vllm-lora-extension'] },
    { name: 'TensorFlow', projects: ['astronomical-image-processing'] },
    { name: 'scikit-learn', projects: ['swasthya'] },
    { name: 'LightGBM', projects: ['swasthya'] },
  ] },
  { name: { en: 'LLM Engineering', de: 'LLM-Entwicklung' }, skills: [
    { name: 'vLLM', projects: ['vllm-pagedattention-benchmark', 'vllm-lora-extension', 'sib-doc'] },
    { name: 'PEFT / LoRA', projects: ['vllm-lora-extension'] },
    { name: 'Hugging Face', projects: ['vllm-pagedattention-benchmark', 'vllm-lora-extension'] },
    { name: 'RAG', note: { en: 'Generative AI internship · NASSCOM FutureSkills', de: 'Generative-AI-Praktikum · NASSCOM FutureSkills' } },
  ] },
  { name: { en: 'Data & Platforms', de: 'Daten & Plattformen' }, skills: [
    { name: 'PostgreSQL', projects: ['swasthya', 'ecoshare'] },
    { name: 'Supabase RLS', projects: ['swasthya', 'ecoshare'] },
    { name: 'PostGIS', note: { en: 'Used outside these projects', de: 'Außerhalb dieser Projekte genutzt' } },
    { name: 'Google Cloud', note: { en: 'Gemini & Vertex AI during the NASSCOM internship', de: 'Gemini & Vertex AI im NASSCOM-Praktikum' } },
  ] },
];

const projectTitle = (project) => project.card?.title || project.title;

export default function SkillConstellation({ language }) {
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState('Python');
  const skill = SKILL_GROUPS.flatMap((group) => group.skills).find((item) => item.name === selected);
  const related = new Set(skill?.projects || []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="min-w-0 space-y-6 lg:col-span-7">
        {SKILL_GROUPS.map((group, groupIndex) => (
          <div key={group.name.en} className="relative">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{group.name[language] ?? group.name.en}</p>
            <div className="relative flex flex-wrap gap-2">
              <span aria-hidden="true" className="absolute left-3 right-3 top-1/2 h-px bg-gradient-to-r from-accent-500/30 via-white/10 to-transparent" />
              {group.skills.map((item, index) => {
                const active = selected === item.name;
                return (
                  <motion.button
                    key={item.name}
                    type="button"
                    onClick={() => setSelected(item.name)}
                    onMouseEnter={() => setSelected(item.name)}
                    aria-pressed={active}
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.3, delay: groupIndex * 0.08 + index * 0.04 }}
                    className={`tactile relative min-h-11 rounded-full border px-4 font-mono text-xs transition-colors ${active ? 'border-neon-400 bg-neon-500/15 text-white shadow-[0_0_24px_rgba(255,46,138,0.4)]' : 'border-white/10 bg-[#0d0d14] text-slate-300 hover:border-accent-400/40'}`}
                  >
                    <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle ${item.projects ? 'bg-accent-400' : 'bg-slate-600'}`} aria-hidden="true" />
                    {item.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="min-w-0 lg:col-span-5">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#15131c] to-[#0a0a10] p-5 sm:p-6 lg:sticky lg:top-28" aria-live="polite">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{language === 'de' ? 'Wo es vorkommt' : 'Where it shows up'}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={selected} initial={reducedMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <h3 className="mt-2 font-display text-3xl font-semibold text-white">{selected}</h3>
              {skill?.note && <p className="mt-2 text-sm text-slate-400">{skill.note[language] ?? skill.note.en}</p>}
            </motion.div>
          </AnimatePresence>
          <ul className="mt-5 space-y-2">
            {projects.map((project) => {
              const lit = related.has(project.id);
              return (
                <li key={project.id}>
                  <a
                    href={`${BASE_URL}projects/${project.id}`}
                    className={`flex min-h-11 items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm transition-all duration-300 ${lit ? 'border-accent-400/40 bg-accent-500/10 text-white' : 'border-transparent text-slate-600 hover:text-slate-400'}`}
                    tabIndex={lit ? 0 : -1}
                    aria-hidden={!lit}
                  >
                    <span className="truncate">{projectTitle(project)}</span>
                    <span className={`font-mono text-xs transition-opacity ${lit ? 'text-accent-300 opacity-100' : 'opacity-0'}`}>↗</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
