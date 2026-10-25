import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { projects } from '../../data/projects.js';

// Builds one 1200×630 share image per project, plus "home" for the landing page.
const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFile(require.resolve(`${pkg}/files/${file}`));

const home = {
  id: 'home',
  subtitle: 'M.Sc. Artificial Intelligence · USI Lugano',
  title: 'Adrika Pradhan',
  tagline: 'LLM inference, LoRA serving, trustworthy AI, and deep learning for scientific data — with the limits written down.',
  stats: [
    { label: 'Projects', value: String(projects.length) },
    { label: 'Focus', value: 'LLM systems' },
    { label: 'Based in', value: 'Lugano, CH' },
  ],
};

export const getStaticPaths: GetStaticPaths = () => [
  { params: { id: 'home' }, props: { entry: home } },
  ...projects.map((project) => ({ params: { id: project.id }, props: { entry: project } })),
];

// Shortens at a word boundary so share cards never end mid-word.
const clip = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:·—-]$/, '').trimEnd()}…`;
};

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: typeof home };
  const [interRegular, interBold, mono] = await Promise.all([
    font('@fontsource/inter', 'inter-latin-400-normal.woff'),
    font('@fontsource/inter', 'inter-latin-800-normal.woff'),
    font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'),
  ]);

  const stats = (entry.stats || []).slice(0, 3);
  const node = {
    type: 'div',
    props: {
      style: {
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '64px 72px', background: '#06080F', color: '#F8FAFC', fontFamily: 'Inter',
        backgroundImage: 'radial-gradient(circle at 85% 0%, rgba(61,109,255,0.32), transparent 55%), radial-gradient(circle at 0% 100%, rgba(255,46,138,0.16), transparent 50%)',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 22 },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 },
                  children: [
                    { type: 'div', props: { style: { fontFamily: 'JetBrains Mono', fontSize: 20, color: '#8DB3FF', letterSpacing: 2, textTransform: 'uppercase' }, children: clip(entry.subtitle, 60) } },
                    { type: 'div', props: { style: { fontFamily: 'JetBrains Mono', fontSize: 18, color: '#64748B', flexShrink: 0 }, children: 'adriennie.github.io/Portfolio' } },
                  ],
                },
              },
              { type: 'div', props: { style: { fontSize: entry.title.length > 40 ? 58 : 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }, children: clip(entry.title, 80) } },
              { type: 'div', props: { style: { fontSize: 28, lineHeight: 1.4, color: '#CBD5E1', maxWidth: 1000 }, children: clip(entry.tagline, 150) } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', gap: 18 },
                  children: stats.map((stat) => ({
                    type: 'div',
                    props: {
                      style: { display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 22px', borderRadius: 18, border: '1px solid rgba(94,143,255,0.45)', background: 'rgba(61,109,255,0.08)', maxWidth: 340 },
                      children: [
                        { type: 'div', props: { style: { fontFamily: 'JetBrains Mono', fontSize: 22, color: '#FFFFFF' }, children: clip(stat.value, 30) } },
                        { type: 'div', props: { style: { fontSize: 16, color: '#94A3B8' }, children: clip(stat.label, 34) } },
                      ],
                    },
                  })),
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(node as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: interBold, weight: 800, style: 'normal' },
      { name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' },
    ],
  });
  const png = new Resvg(svg).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
