import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Splits "5,781.4 lines/s" into prefix, number and suffix so only the number animates.
function parseLeadingNumber(value) {
  const match = String(value).match(/^([^\d]*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s);
  if (!match) return null;
  const [, prefix, raw, suffix] = match;
  // Lists and ranges ("r = 4, 8, 16", "0.51 → 0.69") read wrong mid-count, so only single numbers animate.
  if (/\d/.test(suffix)) return null;
  // Single-digit whole numbers ("7 days", "Project 1") gain nothing from counting.
  if (!raw.includes('.') && Number(raw.replace(/,/g, '')) < 10) return null;
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return { prefix, suffix, target: Number(raw.replace(/,/g, '')), decimals, grouped: raw.includes(',') };
}

function formatNumber(number, { decimals, grouped }) {
  return number.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
}

// Counts the leading number of a stat up from zero the first time it scrolls into view.
export function CountUp({ value, duration = 1100, className }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const parsed = parseLeadingNumber(value);
  const [display, setDisplay] = useState(value);

  useIsoLayoutEffect(() => {
    if (!parsed || reducedMotion || parsed.target === 0) return undefined;
    setDisplay(`${parsed.prefix}${formatNumber(0, parsed)}${parsed.suffix}`);
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(`${parsed.prefix}${formatNumber(parsed.target * eased, parsed)}${parsed.suffix}`);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value, reducedMotion]);

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

// Pulls its child slightly toward the pointer and springs back on leave. Pointer devices only.
export function Magnetic({ children, strength = 0.25, className = 'inline-flex' }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);

  const onMove = (event) => {
    if (reducedMotion || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ transition: 'transform 380ms cubic-bezier(0.22, 1.4, 0.36, 1)' }}
    >
      {children}
    </span>
  );
}

const SCRAMBLE_GLYPHS = '!<>-_\\/[]{}=+*^?#01';

// Cycles through phrases, decrypting each one character by character.
export function ScrambleText({ phrases, interval = 2600, className }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState(phrases[0]);

  useEffect(() => {
    setIndex(0);
    setDisplay(phrases[0]);
  }, [phrases.join('|')]);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(phrases[index]);
      const timer = window.setTimeout(() => setIndex((i) => (i + 1) % phrases.length), interval);
      return () => window.clearTimeout(timer);
    }
    const from = display;
    const to = phrases[index];
    const length = Math.max(from.length, to.length);
    const queue = Array.from({ length }, (_, i) => {
      const start = Math.floor(Math.random() * 12);
      return { from: from[i] || '', to: to[i] || '', start, end: start + 8 + Math.floor(Math.random() * 12) };
    });
    let frame = 0;
    let raf;
    let timer;
    const step = () => {
      let done = 0;
      const text = queue.map(({ from: a, to: b, start, end }) => {
        if (frame >= end) { done += 1; return b; }
        if (frame >= start) return b === ' ' ? ' ' : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
        return a;
      }).join('');
      setDisplay(text);
      if (done === queue.length) {
        timer = window.setTimeout(() => setIndex((i) => (i + 1) % phrases.length), interval);
        return;
      }
      frame += 1;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(timer); };
  }, [index, reducedMotion, phrases.join('|')]);

  return (
    <span className={className} aria-live="off">
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{phrases.join(', ')}</span>
    </span>
  );
}

// A heading line that rises through an invisible mask the first time it enters the viewport.
// The wrapper is observed, not the moving line: the line starts clipped, so it never "intersects".
export function MaskReveal({ children, delay = 0, className = '' }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.16em] -mb-[0.08em] ${className}`}
      initial={reducedMotion ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: '105%' }, shown: { y: '0%' } }}
        transition={{ duration: 0.75, delay, ease: [0.2, 0.75, 0.25, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

// Editorial section header: mono index label plus a masked display heading.
export function SectionHeading({ index, label, title, accent, intro, id }) {
  return (
    <header className="max-w-4xl space-y-4">
      <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
        <span className="text-accent-400">{index}</span>
        <span className="h-px w-10 bg-white/20" aria-hidden="true" />
        {label}
      </p>
      <h2 id={id} className="font-display text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-white">
        <MaskReveal>{title}</MaskReveal>
        {accent && <MaskReveal delay={0.08} className="neon-glow text-neon-400">{accent}</MaskReveal>}
      </h2>
      {intro && <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">{intro}</p>}
    </header>
  );
}

// Letters slide up from below a mask one after another, then settle.
export function KineticText({ text, className = '', delay = 0, stagger = 0.045 }) {
  const reducedMotion = useReducedMotion();
  return (
    <span className={`inline-flex overflow-hidden pb-[0.06em] ${className}`} aria-label={text}>
      {Array.from(text).map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          initial={reducedMotion ? false : { y: '110%', scaleY: 1.25 }}
          animate={{ y: '0%', scaleY: 1 }}
          transition={{ duration: 0.7, delay: delay + index * stagger, ease: [0.2, 0.85, 0.25, 1] }}
          style={{ transformOrigin: '50% 100%' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// Tilts toward the pointer with a soft highlight under it; springs back on leave. Mouse only.
export function TiltSurface({ children, className = '', max = 6 }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const onMove = (event) => {
    if (reducedMotion || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    ref.current.style.transform = `perspective(1100px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg)`;
    ref.current.style.setProperty('--glow-x', `${x * 100}%`);
    ref.current.style.setProperty('--glow-y', `${y * 100}%`);
  };
  const reset = () => {
    if (!ref.current) return;
    ref.current.style.transform = '';
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={{ transition: 'transform 420ms cubic-bezier(0.22, 1.2, 0.36, 1)' }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [.group:hover_&]:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(94,143,255,0.12), transparent 60%)' }}
      />
      {children}
    </div>
  );
}
