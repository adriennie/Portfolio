import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { timelineEvents } from '../data/timeline.js';
import PortfolioTerminal from './PortfolioTerminal.jsx';
import ProjectShowcase from './ProjectShowcase.jsx';
import SkillConstellation from './SkillConstellation.jsx';
import CareerTimeline from './CareerTimeline.jsx';
import HeroConstellation from './HeroConstellation.jsx';
import { KineticText, Magnetic, MaskReveal, ScrambleText, SectionHeading } from './MotionKit.jsx';
import { projects } from '../data/projects.js';
import profilePhoto from '../assets/image.png';

const BASE_URL = `${import.meta.env.BASE_URL}/`;
// The page background shifts a few shades as each section takes over the screen.
const SECTION_TINTS = {
  home: '#05060d',
  projects: '#060918',
  terminal: '#05060d',
  about: '#0c0716',
  skills: '#060918',
  certificates: '#0a0712',
  contact: '#12061a',
};

export function HeroProfileCard({ compact = false }) {
  const [showAddedPhoto, setShowAddedPhoto] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || compact) return undefined;
    const interval = window.setInterval(() => setShowAddedPhoto((showing) => !showing), 3500);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, compact]);

  // Portrait opens through an expanding circular mask, then a halo pulses once.
  const reveal = prefersReducedMotion ? {} : {
    initial: { clipPath: 'circle(0% at 50% 50%)' },
    animate: { clipPath: 'circle(72% at 50% 50%)' },
    transition: { duration: 0.9, delay: 0.25, ease: [0.2, 0.75, 0.25, 1] },
  };

  if (compact) {
    return (
      <motion.img
        {...reveal}
        src="https://github.com/adriennie.png?size=160"
        alt="Portrait of Adrika Pradhan"
        width="56"
        height="56"
        decoding="async"
        className="h-14 w-14 flex-none rounded-full border border-accent-400/60 object-cover shadow-[0_0_24px_rgba(61,109,255,0.35)]"
      />
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        aria-hidden="true"
        className="absolute h-[22rem] w-[22rem] rounded-full border border-accent-400/25 xl:h-[26rem] xl:w-[26rem]"
        initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.06, 1], opacity: [0, 0.9, 0.6] }}
        transition={{ duration: 1.4, delay: 0.9 }}
      />
      <motion.div {...reveal} className="relative">
        <button
          type="button"
          onClick={() => setShowAddedPhoto((showing) => !showing)}
          aria-label={showAddedPhoto ? 'Show profile picture' : 'Show added portrait'}
          aria-pressed={showAddedPhoto}
          className="group h-80 w-80 rounded-full text-left outline-none focus-visible:ring-4 focus-visible:ring-accent-300/80 xl:h-96 xl:w-96"
          style={{ perspective: '1200px' }}
        >
          <span
            className="relative block h-full w-full rounded-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: showAddedPhoto ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: prefersReducedMotion ? 'none' : 'transform 1000ms cubic-bezier(0.2, 0.75, 0.25, 1)',
            }}
          >
            <img
              src="https://github.com/adriennie.png?size=384"
              alt="Portrait of Adrika Pradhan"
              width="384"
              height="384"
              fetchPriority="high"
              decoding="async"
              loading="eager"
              className="absolute inset-0 h-full w-full rounded-full border border-accent-400/50 bg-[#0B0F1A] object-cover shadow-[0_0_60px_rgba(61,109,255,0.25)]"
              style={{ backfaceVisibility: 'hidden' }}
            />
            <img
              src={profilePhoto.src}
              alt="Adrika Pradhan in a red outfit"
              width={profilePhoto.width}
              height={profilePhoto.height}
              decoding="async"
              loading="lazy"
              className="absolute inset-0 h-full w-full rounded-full border border-accent-400/50 bg-[#0B0F1A] object-cover object-[center_38%] shadow-[0_0_60px_rgba(61,109,255,0.25)]"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            />
          </span>
        </button>
      </motion.div>
    </div>
  );
}

export default function PortfolioGrid() {
  const [language, setLanguage] = useState('en');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [selectedCommand, setSelectedCommand] = useState(0);
  const paletteInputRef = useRef(null);
  const [activeNav, setActiveNav] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [emailDraftRequested, setEmailDraftRequested] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [bottomNavHidden, setBottomNavHidden] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const reducedMotion = useReducedMotion();
  // Hero drifts up, shrinks and fades as it scrolls away; the node field moves slower for depth.
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroContentY = useTransform(heroProgress, [0, 1], ['0%', '-18%']);
  const heroContentScale = useTransform(heroProgress, [0, 1], [1, 0.92]);
  const heroContentOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const heroFieldY = useTransform(heroProgress, [0, 1], ['0%', '25%']);
  const t = (english, german) => language === 'de' ? german : english;
  const heroFocusAreas = language === 'de'
    ? ['LLM-Inferenz', 'LoRA-Serving', 'Vertrauenswürdige KI', 'Wissenschaftliche Bildgebung']
    : ['LLM inference', 'LoRA serving', 'Trustworthy AI', 'Scientific imaging'];
  const sectionLabels = language === 'de'
    ? { home: 'Start', projects: 'Arbeiten', terminal: 'Labor', about: 'Über mich', skills: 'Kenntnisse', certificates: 'Anerkennung', contact: 'Kontakt' }
    : { home: 'Home', projects: 'Work', terminal: 'Lab', about: 'About', skills: 'Skills', certificates: 'Recognition', contact: 'Contact' };
  const bottomNavItems = [
    { id: 'home', icon: '⌂' },
    { id: 'projects', icon: '◆' },
    { id: 'terminal', icon: '>_' },
    { id: 'about', icon: '◎' },
  ];
  const commandItems = [
    { label: t('Home', 'Startseite'), keywords: 'home start hero', href: '#home' },
    { label: t('About me', 'Über mich'), keywords: 'about biography profile', href: '#about' },
    { label: t('Skills', 'Kenntnisse'), keywords: 'skills tools technology', href: '#skills' },
    { label: t('Certificates & achievements', 'Zertifikate & Auszeichnungen'), keywords: 'certificates awards', href: '#certificates' },
    { label: t('Projects', 'Projekte'), keywords: 'work portfolio', href: '#projects' },
    ...projects.map((project) => ({
      label: project.card?.title || project.title,
      keywords: `${project.id} ${project.subtitle} ${project.tags.join(' ')}`.toLowerCase(),
      href: `${BASE_URL}projects/${project.id}`,
    })),
    { label: t('Research console', 'Forschungskonsole'), keywords: 'terminal research console', href: '#terminal' },
    { label: t('Terminal: replay log-triage stream', 'Konsole: Log-Triage-Stream abspielen'), keywords: 'run triage terminal replay demo logs', action: 'terminal', command: 'run triage', href: '#terminal' },
    { label: t('Terminal: vLLM benchmark at batch 32', 'Konsole: vLLM-Benchmark bei Batch 32'), keywords: 'bench benchmark terminal vllm throughput', action: 'terminal', command: 'bench --batch 32', href: '#terminal' },
    { label: t('Contact', 'Kontakt'), keywords: 'email reach out', href: '#contact' },
    { label: t('View résumé', 'Lebenslauf ansehen'), keywords: 'cv resume pdf', action: 'resume' },
  ];
  const filteredCommands = commandItems.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(paletteQuery.trim().toLowerCase()));
  const localizedTimelineEvents = language === 'de' ? timelineEvents.map((event) => ({
    ...event,
    title: event.title === 'M.Sc. Artificial Intelligence' ? 'M.Sc. Künstliche Intelligenz' : event.title === 'Generative AI Engineering Intern' ? 'Praktikum im Bereich Generative KI' : 'B.Tech Informatik (KI & ML)',
    type: event.type === 'Education' ? 'Studium' : 'Berufserfahrung',
    description: event.title === 'M.Sc. Artificial Intelligence'
      ? 'Masterstudium mit Schwerpunkt auf den Grundlagen und der Entwicklung künstlicher Intelligenz.'
      : event.title === 'Generative AI Engineering Intern'
        ? 'Entwicklung und Bewertung von RAG-Prototypen mit Gemini und Vertex AI – mit Fokus auf reproduzierbare Konfigurationen und Produktionsreife.'
        : 'Schwerpunkt Künstliche Intelligenz und maschinelles Lernen; Abschlussnote 7,91/10 und 9,18 sowie 10,0 SGPA in den letzten beiden Semestern.',
    highlights: event.highlights.map((highlight) => ({
      'M.Sc. AI Candidate': 'M.Sc.-Studierende',
      'Swiss Student Permit (B)': 'Schweizer Aufenthaltsbewilligung B',
      'Lugano, Switzerland': 'Lugano, Schweiz',
      'RAG Prototypes': 'RAG-Prototypen',
      'Evaluation Frameworks': 'Evaluierungsrahmen',
      'Astronomical Denoising (learning project)': 'Astronomische Entrauschung (Lernprojekt)',
      'Group major projects: EcoShare & Swasthya': 'Gruppen-Hauptprojekte: EcoShare & Swasthya',
    }[highlight] || highlight)),
  })) : timelineEvents;

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('portfolio-language');
    if (savedLanguage === 'de' || savedLanguage === 'en') setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    try { window.localStorage.setItem('portfolio-language', language); } catch { /* Language still works for this visit. */ }
    document.title = language === 'de' ? 'Adrika Pradhan | KI-Portfolio' : 'Adrika Pradhan | AI Portfolio';
    const localizedDescription = language === 'de'
      ? 'Adrika Pradhan studiert Künstliche Intelligenz an der USI Lugano und arbeitet an LLM-Systemen, angewandtem maschinellem Lernen und wissenschaftlichen Daten.'
      : 'Adrika Pradhan is an M.Sc. Artificial Intelligence student at USI Lugano, focused on LLM systems, applied machine learning, and scientific data.';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = localizedDescription;
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', localizedDescription);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', localizedDescription);
  }, [language]);

  useEffect(() => {
    const onShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        setIsPaletteOpen((open) => !open);
        setPaletteQuery('');
        setSelectedCommand(0);
      }
      if (event.key === 'Escape') {
        setIsPaletteOpen(false);
        setIsResumeOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  useEffect(() => {
    if (!isPaletteOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isPaletteOpen]);

  useEffect(() => {
    if (!isResumeOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isResumeOpen]);

  useEffect(() => {
    if (isPaletteOpen) paletteInputRef.current?.focus();
  }, [isPaletteOpen]);

  useEffect(() => {
    if (isPaletteOpen) document.getElementById(`portfolio-command-${selectedCommand}`)?.scrollIntoView({ block: 'nearest' });
  }, [isPaletteOpen, selectedCommand]);

  useEffect(() => setSelectedCommand(0), [paletteQuery]);

  const navigateToSection = (event, section) => {
    event?.preventDefault();
    const overlayWasOpen = isMobileMenuOpen || isPaletteOpen;
    setIsMobileMenuOpen(false);
    setIsPaletteOpen(false);
    setActiveNav(section);

    const hash = `#${section}`;
    if (window.location.hash !== hash) window.history.pushState(window.history.state, '', hash);

    const scrollToSection = () => {
      document.getElementById(section)?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    };

    if (overlayWasOpen) {
      window.requestAnimationFrame(() => window.requestAnimationFrame(scrollToSection));
    } else {
      scrollToSection();
    }
  };

  const runPaletteCommand = (item) => {
    if (item.action === 'resume') {
      setIsPaletteOpen(false);
      setIsResumeOpen(true);
      return;
    }
    if (item.action === 'terminal') {
      navigateToSection(null, 'terminal');
      window.setTimeout(() => window.dispatchEvent(new CustomEvent('portfolio-terminal-run', { detail: item.command })), reducedMotion ? 0 : 450);
      return;
    }
    if (item.href.startsWith('#')) {
      navigateToSection(null, item.href.slice(1));
      return;
    }
    setIsPaletteOpen(false);
    window.location.assign(item.href);
  };

  useEffect(() => {
    const sections = document.querySelectorAll('#home, #about, #skills, #certificates, #projects, #terminal, #contact');
    const observer = new IntersectionObserver((entries) => {
      const visibleSection = entries.find((entry) => entry.isIntersecting);
      if (visibleSection) setActiveNav(visibleSection.target.id);
    }, { rootMargin: '-25% 0px -65% 0px' });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    const closeOnDesktopResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktopResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktopResize);
    };
  }, [isMobileMenuOpen]);

  const skillGroups = [
    { name: 'Programming', items: ['Python', 'SQL', 'TypeScript', 'Java'] },
    { name: 'Machine Learning', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'LightGBM'] },
    { name: 'LLM Engineering', items: ['vLLM', 'PEFT / LoRA', 'Hugging Face', 'RAG'] },
    { name: 'Data & Platforms', items: ['PostgreSQL', 'Supabase RLS', 'PostGIS', 'Google Cloud'] },
  ];

  const certificatesList = [
    { name: "Microsoft Certified: Azure AI Engineer Associate (AI-102)", issuer: "Microsoft", date: "April 2026", credential: "P8376A-B25D52" },
    { name: "Building Large Language Models on Amazon Bedrock", issuer: "AWS", date: "2026" },
    { name: "Generative AI Virtual Internship", issuer: "Google Cloud / NASSCOM", date: "Jun '25 - Jul '25" }
  ];

  const achievementsList = [
    { title: "TCS CodeVita 2025", desc: "Advanced to Round 2 (Rank: 2083 / 6138)" },
    { title: "Code4Bharat Hackathon", desc: "National Semifinalist" },
    { title: "Care-a-Thon (Sukhyam)", desc: "Finalist; awarded ₹50,000 innovation grant" }
  ];

  // Hero scroll cue, back-to-top button, and a bottom bar that hides while scrolling down.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setHasScrolled(y > 40);
      setShowBackToTop(y > window.innerHeight * 1.5);
      if (Math.abs(y - lastY) > 6) setBottomNavHidden(y > lastY && y > 240);
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('adrika.pradhan@usi.ch');
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      window.location.href = 'mailto:adrika.pradhan@usi.ch';
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${t('Portfolio message from', 'Portfolionachricht von')} ${contactForm.name}`);
    const body = encodeURIComponent(`${contactForm.message}\n\nFrom: ${contactForm.name}\nReply to: ${contactForm.email}`);
    window.location.href = `mailto:adrika.pradhan@usi.ch?subject=${subject}&body=${body}`;
    setEmailDraftRequested(true);
  };

  return (
      <div lang={language} style={{ backgroundColor: SECTION_TINTS[activeNav] || SECTION_TINTS.home, transition: reducedMotion ? 'none' : 'background-color 900ms ease' }} className="min-h-screen text-slate-100 font-sans selection:bg-accent-500/30 selection:text-accent-200 relative overflow-x-clip">
      
      {/* Ambient Pink Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-accent-600/10 rounded-full blur-[160px] pointer-events-none"></div>

      <a className="skip-link" href="#home">{t('Skip to content', 'Zum Inhalt springen')}</a>

      <div className="progress-rail" aria-hidden="true" />

      {/* Floating Pill Navigation Bar */}
      <div className="site-navigation sticky top-3 z-50 px-4">
        <nav className="mx-auto flex max-w-fit items-center justify-between gap-2 rounded-full border border-white/15 bg-[#0d0d14]/70 px-3 py-2 text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:gap-3 sm:px-4 lg:gap-4">
          <a href="#home" onClick={(event) => navigateToSection(event, 'home')} className="px-1 font-mono text-sm font-extrabold tracking-[0.14em] text-white">ADRIKA</a>
          <div className="hidden items-center text-xs font-semibold tracking-wide lg:flex">
            {Object.entries(sectionLabels).map(([tab, label]) => (
              <a
                key={tab}
                href={`#${tab}`}
                onClick={(event) => navigateToSection(event, tab)}
                aria-current={activeNav === tab ? 'location' : undefined}
                className={`relative rounded-full px-3 py-2 uppercase transition-colors duration-200 xl:px-3.5 ${activeNav === tab ? 'text-white' : 'text-slate-400 hover:text-accent-200'}`}
              >
                {activeNav === tab && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.09]"
                    transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{label}</span>
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
            aria-label={language === 'en' ? 'Sprache auf Deutsch umstellen' : 'Switch language to English'}
            aria-pressed={language === 'de'}
            className="tactile min-h-9 rounded-full border border-white/15 bg-white/[0.06] px-3 text-[10px] font-mono font-semibold tracking-wide text-slate-200 transition-colors hover:bg-white/[0.12]"
          >
            {language === 'en' ? 'DE' : 'EN'}
          </button>
          <button
            type="button"
            onClick={() => { setIsPaletteOpen(true); setIsMobileMenuOpen(false); setPaletteQuery(''); }}
            aria-label={t('Open command palette', 'Befehlspalette öffnen')}
            aria-keyshortcuts="Control+K Meta+K"
            className="hidden min-h-9 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 text-[10px] font-mono text-slate-300 transition-colors hover:bg-white/[0.12] hover:text-white md:inline-flex"
          >
            ⌘K
          </button>
          <button
            onClick={() => setIsResumeOpen(true)}
            className="tactile min-h-9 rounded-full border border-accent-200/20 bg-gradient-to-b from-accent-400 to-accent-600 px-4 text-xs font-semibold text-white shadow-[0_5px_18px_rgba(61,109,255,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(61,109,255,0.35)] sm:px-5"
          >
            {t('CV', 'Lebenslauf')}
          </button>
        </nav>
      </div>

      {/* Mobile & tablet: floating bottom navigation */}
      <motion.nav
        aria-label={t('Quick navigation', 'Schnellnavigation')}
        className="bottom-nav fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 lg:hidden"
        animate={{ y: bottomNavHidden && !isMobileMenuOpen ? 'calc(100% + 1rem)' : '0%' }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38 }}
      >
        <div className="mb-2 flex items-center gap-1 rounded-full border border-white/15 bg-[#0d0d14]/85 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          {bottomNavItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => navigateToSection(event, item.id)}
              aria-current={activeNav === item.id ? 'location' : undefined}
              className={`tactile relative flex min-h-12 min-w-[3.75rem] flex-col items-center justify-center rounded-full px-2 text-[10px] font-medium transition-colors ${activeNav === item.id ? 'text-white' : 'text-slate-400'}`}
            >
              {activeNav === item.id && (
                <motion.span layoutId="bottom-nav-pill" className="absolute inset-0 rounded-full bg-accent-500/20 ring-1 ring-accent-400/40" transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} />
              )}
              <span aria-hidden="true" className="relative font-mono text-sm leading-none">{item.icon}</span>
              <span className="relative mt-1">{sectionLabels[item.id]}</span>
            </a>
          ))}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label={t('Open navigation menu', 'Navigationsmenü öffnen')}
            aria-expanded={isMobileMenuOpen}
            className={`tactile relative flex min-h-12 min-w-[3.75rem] flex-col items-center justify-center rounded-full px-2 text-[10px] font-medium ${['skills', 'certificates', 'contact'].includes(activeNav) ? 'text-white' : 'text-slate-400'}`}
          >
            <span aria-hidden="true" className="font-mono text-sm leading-none">☰</span>
            <span className="mt-1">{t('More', 'Mehr')}</span>
          </button>
        </div>
      </motion.nav>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
            aria-label={t('Back to top', 'Nach oben')}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="tactile fixed bottom-8 right-8 z-40 hidden h-11 w-11 lg:grid place-items-center rounded-full border border-white/15 bg-[#0d0d14]/85 text-slate-200 shadow-xl backdrop-blur-xl transition-colors hover:text-white"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile menu: bottom sheet */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t('Site navigation', 'Seitennavigation')}
              initial={reducedMotion ? false : { y: '100%' }}
              animate={{ y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { y: '100%' }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 36 }}
              drag={reducedMotion ? false : 'y'}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(event, info) => { if (info.offset.y > 90 || info.velocity.y > 500) setIsMobileMenuOpen(false); }}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key !== 'Tab') return;
                const focusable = event.currentTarget.querySelectorAll('button, a[href]');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
              }}
              className="bottom-nav absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-[2rem] border-t border-white/15 bg-gradient-to-b from-[#17151f] to-[#0d0d14] px-5 pt-3 shadow-[0_-20px_70px_rgba(0,0,0,0.5)]"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" aria-hidden="true" />
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="font-mono text-sm font-bold tracking-[0.18em] text-white">ADRIKA</p>
                  <p className="mt-1 text-[11px] text-slate-400">M.Sc. AI · USI Lugano</p>
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label={t('Close navigation menu', 'Navigationsmenü schließen')}
                  className="tactile grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-lg text-slate-300"
                >
                  ×
                </button>
              </div>
              <nav className="grid grid-cols-2 gap-2" aria-label={t('Mobile navigation', 'Mobile Navigation')}>
                {Object.entries(sectionLabels).map(([tab, label], index) => (
                  <motion.a
                    key={tab}
                    href={`#${tab}`}
                    onClick={(event) => navigateToSection(event, tab)}
                    aria-current={activeNav === tab ? 'location' : undefined}
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reducedMotion ? 0 : 0.05 + index * 0.035, duration: reducedMotion ? 0 : 0.22 }}
                    className={`tactile flex min-h-14 items-center gap-3 rounded-2xl border px-4 font-mono text-sm uppercase tracking-wide ${activeNav === tab ? 'border-accent-400/40 bg-accent-500/10 text-white' : 'border-white/10 bg-white/[0.03] text-slate-300'}`}
                  >
                    <span className="text-[10px] text-accent-400/80">0{index + 1}</span>
                    {label}
                  </motion.a>
                ))}
              </nav>
              <div className="grid grid-cols-2 gap-2 py-4">
                <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIsPaletteOpen(true); setPaletteQuery(''); }} className="tactile min-h-12 rounded-2xl border border-white/10 font-mono text-xs text-slate-300">{t('Search · ⌘K', 'Suchen · ⌘K')}</button>
                <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIsResumeOpen(true); }} className="tactile min-h-12 rounded-2xl bg-gradient-to-b from-accent-400 to-accent-600 font-mono text-xs font-semibold text-white">{t('Resume / CV', 'Lebenslauf')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaletteOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-950/65 px-4 pt-[12vh] backdrop-blur-md"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.16 }}
            onMouseDown={(event) => { if (event.target === event.currentTarget) setIsPaletteOpen(false); }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="command-palette-title"
              initial={reducedMotion ? false : { opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0 : 0.18 }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#111521]/95 shadow-[0_24px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') { event.preventDefault(); setSelectedCommand((index) => Math.min(index + 1, filteredCommands.length - 1)); }
                if (event.key === 'ArrowUp') { event.preventDefault(); setSelectedCommand((index) => Math.max(index - 1, 0)); }
                if (event.key === 'Enter' && filteredCommands[selectedCommand]) { event.preventDefault(); runPaletteCommand(filteredCommands[selectedCommand]); }
                if (event.key === 'Tab') {
                  const focusable = event.currentTarget.querySelectorAll('input, button:not([tabindex="-1"])');
                  const first = focusable[0];
                  const last = focusable[focusable.length - 1];
                  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
                }
              }}
            >
              <h2 id="command-palette-title" className="sr-only">{t('Portfolio command palette', 'Portfolio-Befehlspalette')}</h2>
              <label className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
                <span aria-hidden="true" className="text-lg text-accent-300">⌕</span>
                <input
                  ref={paletteInputRef}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="portfolio-command-list"
                  aria-activedescendant={filteredCommands.length ? `portfolio-command-${selectedCommand}` : undefined}
                  aria-label={t('Search sections, projects, and actions', 'Bereiche, Projekte und Aktionen suchen')}
                  value={paletteQuery}
                  onChange={(event) => setPaletteQuery(event.target.value)}
                  placeholder={t('Search sections, projects, CV…', 'Bereiche, Projekte, Lebenslauf suchen…')}
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
                <kbd className="hidden rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-500 sm:inline">ESC</kbd>
                <button type="button" aria-label={t('Close command palette', 'Befehlspalette schließen')} onClick={() => setIsPaletteOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white">×</button>
              </label>
              <div id="portfolio-command-list" role="listbox" aria-label={t('Navigation commands', 'Navigationsbefehle')} className="max-h-[55vh] overflow-y-auto p-2">
                {filteredCommands.length ? filteredCommands.map((item, index) => (
                  <button
                    id={`portfolio-command-${index}`}
                    key={item.label}
                    type="button"
                    tabIndex={-1}
                    role="option"
                    aria-selected={selectedCommand === index}
                    onMouseEnter={() => setSelectedCommand(index)}
                    onClick={() => runPaletteCommand(item)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition-colors ${selectedCommand === index ? 'bg-accent-400/10 text-white' : 'text-slate-300 hover:bg-white/[0.05]'}`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-slate-500">{item.href?.startsWith('#') ? '↵' : '↗'}</span>
                  </button>
                )) : <p className="px-3 py-8 text-center text-sm text-slate-500">{t('No matching commands.', 'Keine passenden Befehle.')}</p>}
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-[10px] text-slate-500 sm:px-5">
                <span>{t('Navigate with ↑ ↓ · select with Enter', 'Navigation mit ↑ ↓ · Auswahl mit Enter')}</span>
                <span className="font-mono">{t('PORTFOLIO', 'PORTFOLIO')}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-24 sm:space-y-32 pt-2 pb-28 sm:pb-24 relative z-10">
        
        {/* SECTION: HOME / HERO */}
        <section id="home" ref={heroRef} className="relative -mx-4 flex min-h-[calc(100svh-5.5rem)] flex-col justify-center overflow-hidden px-4 pb-20 pt-6 scroll-mt-28 sm:-mx-6 sm:px-6 lg:min-h-[calc(100svh-6rem)]">
          <motion.div aria-hidden="true" className="absolute inset-0" style={reducedMotion ? undefined : { y: heroFieldY }}>
            <HeroConstellation className="opacity-70 [mask-image:radial-gradient(ellipse_at_60%_40%,black_35%,transparent_80%)]" />
          </motion.div>
          <motion.div
            className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6"
            style={reducedMotion ? undefined : { y: heroContentY, scale: heroContentScale, opacity: heroContentOpacity, transformOrigin: '30% 40%' }}
          >
            <div className="min-w-0 space-y-6 lg:col-span-8">
              <div className="flex items-center gap-4">
                <div className="lg:hidden"><HeroProfileCard compact /></div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent-300">
                  {t('Hi, I’m', 'Hallo, ich bin')}<span className="mx-2 text-white/30">/</span>{t('M.Sc. AI · USI Lugano', 'M.Sc. KI · USI Lugano')}
                </p>
              </div>
              <h1 className="font-display text-[clamp(3.6rem,13vw,9.5rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-white">
                <span className="block"><KineticText text="Adrika" delay={0.1} /></span>
                <span className="block"><KineticText text="Pradhan." className="bg-gradient-to-r from-accent-400 via-neon-400 to-neon-300 bg-clip-text text-transparent" delay={0.35} /></span>
              </h1>
              <h2 className="min-h-[2.25rem] font-mono text-lg font-medium text-slate-400 sm:text-2xl">
                <span className="text-slate-600">&gt; </span>
                <ScrambleText phrases={heroFocusAreas} className="text-accent-300" />
                <span aria-hidden="true" className="animate-pulse text-neon-400">▍</span>
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-slate-300/90 sm:text-lg">
                {t('I turn careful experiments into practical, resource-aware AI systems — from LLM inference and LoRA serving to deep learning for scientific data.', 'Ich mache aus sorgfältigen Experimenten praktische, ressourcenschonende KI-Systeme – von LLM-Inferenz und LoRA-Serving bis zu Deep Learning für wissenschaftliche Daten.')}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Magnetic>
                  <a href="#projects" onClick={(event) => navigateToSection(event, 'projects')} className="tactile inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-mono text-xs font-bold text-[#09090F] shadow-xl shadow-accent-500/10 transition-colors hover:bg-accent-200">
                    {t('See the work', 'Projekte ansehen')} <span aria-hidden="true">↓</span>
                  </a>
                </Magnetic>
                <Magnetic>
                  <button type="button" onClick={() => setIsResumeOpen(true)} className="tactile inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-accent-500 to-neon-600 px-6 font-mono text-xs font-bold text-white shadow-xl shadow-accent-500/30 transition-shadow hover:shadow-accent-500/50">
                    {t('Resume / CV', 'Lebenslauf')}
                  </button>
                </Magnetic>
                <Magnetic>
                  <a aria-label="GitHub" href="https://github.com/adriennie" target="_blank" rel="noreferrer" className="tactile inline-flex min-h-12 items-center rounded-full border border-white/15 px-5 text-sm text-slate-200 transition-colors hover:border-accent-400/50 hover:text-white">GitHub</a>
                </Magnetic>
                <Magnetic>
                  <a aria-label="LinkedIn" href="https://www.linkedin.com/in/adrika-pradhan-3a92622ba/" target="_blank" rel="noreferrer" className="tactile inline-flex min-h-12 items-center rounded-full border border-white/15 px-5 text-sm text-slate-200 transition-colors hover:border-accent-400/50 hover:text-white">LinkedIn</a>
                </Magnetic>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 font-mono text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-2 text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{t('Open to research collaborations & studentships', 'Offen für Forschungskooperationen & Studierendenstellen')}</span>
                <span>{t('English B2 · German A1, learning', 'Englisch B2 · Deutsch A1, im Lernprozess')}</span>
              </div>
            </div>
            <div className="hidden justify-center lg:col-span-4 lg:flex">
              <HeroProfileCard />
            </div>
          </motion.div>
          <a href="#projects" onClick={(event) => navigateToSection(event, 'projects')} aria-label={t('Scroll to selected work', 'Zu den Projekten scrollen')} className={`absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 transition-opacity duration-500 sm:flex ${hasScrolled ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
            {t('Scroll', 'Scrollen')}
            <span className="relative h-10 w-px bg-white/15"><span className="scroll-cue-dot absolute -left-[2px] top-0 h-[5px] w-[5px] rounded-full bg-accent-400" /></span>
          </a>
        </section>

        <div className="-mx-4 -mt-10 border-y border-white/[0.06] px-4 py-5 sm:-mx-6 sm:-mt-16 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">{t('Tools I work with', 'Werkzeuge')}</span>
            {['Python', 'PyTorch', 'vLLM', 'Hugging Face', 'Google Cloud', 'PostgreSQL'].map((tool) => (
              <span key={tool} className="font-display text-sm font-medium tracking-wide text-slate-400 sm:text-base">{tool}</span>
            ))}
          </div>
        </div>

        {/* SECTION: SELECTED WORK */}
        <section id="projects" className="space-y-10 pt-12 scroll-mt-28">
          <SectionHeading
            index="02"
            label={t('Selected work', 'Ausgewählte Arbeiten')}
            title={t('Selected', 'Ausgewählte')}
            accent={t('work.', 'Arbeiten.')}
            intro={t('Flagship projects first, each with the recorded numbers behind it. Open one for the full problem, method, results and limits.', 'Zuerst die Hauptprojekte, jeweils mit den aufgezeichneten Zahlen. Jede Fallstudie zeigt Problem, Methode, Ergebnisse und Grenzen.')}
          />
          <ProjectShowcase language={language} />
        </section>

        {/* SECTION: PORTFOLIO TERMINAL */}
        <section id="terminal" className="space-y-10 pt-12 scroll-mt-28">
          <SectionHeading
            index="03"
            label={t('Engineering lab', 'Engineering-Labor')}
            title={t('Explore the work,', 'Entdecke die Arbeit,')}
            accent={t('with evidence.', 'mit Belegen.')}
            intro={t('Type a command or tap a chip: replay the log-triage stream, compare inference throughput, or inspect LoRA ranks.', 'Tippe einen Befehl oder wähle einen Chip: Log-Triage-Stream abspielen, Inferenzdurchsatz vergleichen oder LoRA-Ränge ansehen.')}
          />
          <div className="max-w-4xl">
            <PortfolioTerminal
              language={language}
              onOpenResume={() => setIsResumeOpen(true)}
              onNavigate={(section) => navigateToSection(null, section)}
              onLanguageChange={(lang) => setLanguage(lang)}
            />
          </div>
        </section>

        {/* SECTION: ABOUT ME */}
        <section id="about" className="space-y-10 pt-12 scroll-mt-28">
          <SectionHeading
            index="04"
            label={t('About', 'Über mich')}
            title={t('Curious about AI.', 'Neugierig auf KI.')}
            accent={t('Focused on useful impact.', 'Fokus auf praktischen Nutzen.')}
            intro={t('My work sits at the intersection of machine learning research and practical engineering—from scientific imaging to efficient language models.', 'Meine Arbeit verbindet Machine-Learning-Forschung mit praktischer Entwicklung – von wissenschaftlicher Bildverarbeitung bis zu effizienten Sprachmodellen.')}
          />

          <div className="relative overflow-hidden rounded-3xl border border-accent-400/20 bg-gradient-to-r from-accent-500/[0.08] via-[#0B0F1A]/90 to-[#0B0F1A]/90 p-6 sm:p-7">
            <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-300">{t('Open science · Research transparency', 'Open Science · Forschungstransparenz')}</p>
                <p className="text-sm leading-relaxed text-slate-300">{t('The vLLM project publishes notebooks, CSV results, and plots. I document experimental limits too: runtime versions were not pinned and GPU memory was not captured. My astronomy study has a full post-mortem, because its original results did not hold up.', 'Das vLLM-Projekt enthält Notebooks, CSV-Ergebnisse und Diagramme. Ich dokumentiere auch die Grenzen der Experimente: Laufzeitversionen waren nicht festgeschrieben und der GPU-Speicher wurde nicht erfasst. Zu meiner Astronomie-Studie gibt es ein vollständiges Post-Mortem, weil ihre ursprünglichen Ergebnisse nicht haltbar waren.')}</p>
              </div>
              <div className="relative flex flex-wrap gap-2">
                <a href="https://github.com/adriennie/vllm-pagedattention-benchmark" target="_blank" rel="noreferrer" className="rounded-xl border border-accent-500/30 bg-accent-500/10 px-3 py-2 text-xs font-mono text-accent-300 transition-colors hover:bg-accent-500/20">{t('Benchmark artifacts ↗', 'Benchmark-Artefakte ↗')}</a>
                <a href={`${BASE_URL}projects/astronomical-image-processing`} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-mono text-slate-300 transition-colors hover:border-accent-500/30">{t('Astronomy post-mortem ↗', 'Astronomie-Post-Mortem ↗')}</a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 relative overflow-hidden p-7 sm:p-9 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] via-[#0B0F1A] to-[#15101c] shadow-2xl shadow-black/20">
              <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />
              <div className="relative space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/20 bg-accent-400/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-accent-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400" /> {t('M.Sc. Artificial Intelligence · USI Lugano', 'M.Sc. Künstliche Intelligenz · USI Lugano')}
                </span>
                <p className="text-slate-300 text-sm sm:text-base leading-7">
                  {t('I’m an AI graduate student who enjoys turning complex problems into systems people can use. I’ve learned the hard way how to evaluate deep-learning models on noisy astronomy data, explored ways to make LLM inference and fine-tuning more efficient on limited GPUs, and built RAG prototypes during my Generative AI internship with NASSCOM FutureSkills.', 'Ich studiere Künstliche Intelligenz und setze mich gern damit auseinander, komplexe Probleme in nutzbare Systeme zu verwandeln. Ich habe an verrauschten astronomischen Daten gelernt, wie man Deep-Learning-Modelle sorgfältig auswertet, effiziente LLM-Inferenz und Feinabstimmung auf begrenzten GPUs untersucht und während meines Praktikums bei NASSCOM FutureSkills RAG-Prototypen entwickelt.')}
                </p>
                <p className="text-slate-400 text-sm leading-6">
                  {t('I bring a hands-on approach, a strong foundation in computer science, and a particular interest in reliable, resource-aware AI.', 'Ich verbinde eine praxisorientierte Arbeitsweise mit fundierten Informatikkenntnissen und besonderem Interesse an zuverlässiger, ressourcenschonender KI.')}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(language === 'de' ? ['Maschinelles Lernen', 'LLM-Systeme', 'Wissenschaftliche Daten', 'Angewandte KI'] : ['Machine learning', 'LLM systems', 'Scientific data', 'Applied AI']).map((item) => (
                    <span key={item} className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[
                { value: '5.06×', label: t('vs. first HF run', 'gegenüber HF-Transformers'), detail: t('second HF run: 1.43×', 'zweiter HF-Lauf: 1,43×') },
                { value: '0/117', label: t('forbidden requests let through', 'verbotene Anfragen durchgelassen'), detail: t('SIB Doc privacy guard', 'SIB-Doc-Datenschutz-Guard') },
                { value: '7.91', label: 'B.Tech CGPA', detail: t('Computer Science · AI & ML', 'Informatik · KI & ML') },
                { value: 'AI-102', label: t('Azure AI Engineer', 'Azure AI Engineer'), detail: t('Microsoft certified', 'Microsoft-Zertifizierung') },
              ].map((stat) => (
                <div key={stat.label} className="min-h-32 flex flex-col justify-between p-5 rounded-2xl border border-white/10 bg-[#0B0F1A]/80 hover:border-accent-400/30 transition-colors">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{stat.value}</span>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{stat.label}</p>
                    <p className="mt-1 text-[10px] font-mono text-slate-500">{stat.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-5 rounded-2xl border border-white/10 bg-[#0B0F1A]/60">
              <span className="flex-none w-10 h-10 rounded-xl bg-accent-400/10 text-accent-300 flex items-center justify-center text-lg">✳</span>
              <div>
                <h3 className="text-sm font-semibold text-white">{t('Experience', 'Berufserfahrung')}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{t('Generative AI Engineering Intern · NASSCOM FutureSkills. Built RAG pipeline prototypes with Gemini and Vertex AI.', 'Praktikum Generative AI Engineering · NASSCOM FutureSkills. Entwicklung von RAG-Pipeline-Prototypen mit Gemini und Vertex AI.')}</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl border border-white/10 bg-[#0B0F1A]/60">
              <span className="flex-none w-10 h-10 rounded-xl bg-sky-400/10 text-sky-300 flex items-center justify-center text-lg">↗</span>
              <div>
                <h3 className="text-sm font-semibold text-white">{t('Based in Lugano, Switzerland', 'Standort: Lugano, Schweiz')}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{t('English · Professional working proficiency (CEFR B2)', 'Englisch · Selbstständige Sprachverwendung (GER B2)')} <span className="text-slate-600">/</span> {t('German · A1, learning', 'Deutsch · A1, im Lernprozess')}</p>
              </div>
            </div>
          </div>

          <CareerTimeline events={localizedTimelineEvents} heading={t('Academic journey & experience', 'Ausbildung & Erfahrung')} />
        </section>

        {/* SECTION: SKILLS */}
        <section id="skills" className="space-y-10 pt-12 scroll-mt-28">
          <SectionHeading
            index="05"
            label={t('Skills', 'Kenntnisse')}
            title={t('Tools, connected', 'Werkzeuge, verbunden')}
            accent={t('to the work.', 'mit der Arbeit.')}
            intro={t('Pick a skill to see which projects use it.', 'Wähle eine Fähigkeit, um zu sehen, welche Projekte sie nutzen.')}
          />
          <SkillConstellation language={language} />
        </section>

        {/* SECTION: CERTIFICATES & ACHIEVEMENTS */}
        <section id="certificates" className="space-y-10 pt-12 scroll-mt-28">
          <SectionHeading
            index="06"
            label={t('Recognition', 'Anerkennung')}
            title={t('Certificates &', 'Zertifikate &')}
            accent={t('achievements.', 'Auszeichnungen.')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="p-6 rounded-3xl border border-accent-950/80 bg-[#0B0F1A]/80 backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-bold text-accent-400 font-mono">{t('Certificates', 'Zertifikate')}</h3>
              <div className="space-y-3">
                {certificatesList.map((cert, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0E1322] border border-accent-500/20 text-xs space-y-1">
                    <div className="font-bold text-white">{cert.name}</div>
                    <div className="text-slate-400 font-mono flex items-center justify-between gap-2">
                      <span>{cert.issuer} · {cert.date}</span>
                      {cert.credential && (
                        <span className="text-[10px] text-accent-300/90 font-mono">ID: {cert.credential}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-accent-950/80 bg-[#0B0F1A]/80 backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-bold text-accent-400 font-mono">{t('Achievements & Hackathons', 'Auszeichnungen & Hackathons')}</h3>
              <div className="space-y-3">
                {achievementsList.map((ach, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0E1322] border border-accent-500/20 text-xs space-y-1">
                    <div className="font-bold text-white">{ach.title}</div>
                    <div className="text-slate-400 font-mono">{language === 'de' ? (idx === 0 ? 'Runde 2 erreicht (Rang: 2083 / 6138)' : idx === 1 ? 'Nationales Halbfinale' : 'Finalistin; Innovationsförderung in Höhe von ₹50.000 erhalten') : ach.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CONTACT */}
        <section id="contact" className="relative scroll-mt-28 space-y-12 pt-12">
          <div className="space-y-6">
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
              <span className="text-accent-400">07</span><span className="h-px w-10 bg-white/20" aria-hidden="true" />{t('Contact', 'Kontakt')}
            </p>
            <h2 className="font-display text-[clamp(3rem,11vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.045em] text-white">
              <MaskReveal>{t('Let’s build', 'Lass uns etwas')}</MaskReveal>
              <MaskReveal delay={0.08} className="bg-gradient-to-r from-accent-400 via-neon-400 to-neon-300 bg-clip-text text-transparent">{t('something.', 'bauen.')}</MaskReveal>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-slate-400">{t('Open to research collaborations, engineering roles, and technical studentships in and around Lugano.', 'Offen für Forschungskooperationen, Entwicklungsstellen und technische Studierendenstellen in und um Lugano.')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <button type="button" onClick={copyEmail} className="tactile group inline-flex min-h-14 items-center gap-3 rounded-full bg-white px-6 font-mono text-sm font-bold text-[#09090F] transition-colors hover:bg-accent-200" aria-live="polite">
                <span>adrika.pradhan@usi.ch</span>
                <span className="relative grid h-7 w-7 place-items-center rounded-full bg-[#09090F] text-xs text-white">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={emailCopied ? 'done' : 'copy'} initial={reducedMotion ? false : { scale: 0.4, opacity: 0, rotate: -40 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.18 }}>
                      {emailCopied ? '✓' : '⧉'}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="sr-only">{emailCopied ? t('Email copied', 'E-Mail kopiert') : t('Copy email address', 'E-Mail-Adresse kopieren')}</span>
              </button>
            </Magnetic>
            <Magnetic>
              <a href="https://github.com/adriennie" target="_blank" rel="noreferrer" className="tactile inline-flex min-h-14 items-center rounded-full border border-white/15 px-6 text-sm text-slate-200 transition-colors hover:border-accent-400/50 hover:text-white">GitHub ↗</a>
            </Magnetic>
            <Magnetic>
              <a href="https://www.linkedin.com/in/adrika-pradhan-3a92622ba/" target="_blank" rel="noreferrer" className="tactile inline-flex min-h-14 items-center rounded-full border border-white/15 px-6 text-sm text-slate-200 transition-colors hover:border-accent-400/50 hover:text-white">LinkedIn ↗</a>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={() => setIsResumeOpen(true)} className="tactile inline-flex min-h-14 items-center rounded-full border border-white/15 px-6 text-sm text-slate-200 transition-colors hover:border-accent-400/50 hover:text-white">{t('Resume', 'Lebenslauf')} ↓</button>
            </Magnetic>
          </div>

          <details className="group max-w-2xl rounded-3xl border border-white/10 bg-[#0d0d14]/80 open:pb-2">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-6 font-mono text-xs text-slate-300 hover:text-white">
              {t('Or write a message here', 'Oder hier eine Nachricht schreiben')}
              <span className="text-accent-400 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <div className="px-6 pb-4">
              {emailDraftRequested ? (
                <p className="py-6 text-sm text-slate-400">{t('Your email app should open with the message ready. If it didn’t, email', 'Dein E-Mail-Programm sollte sich mit der Nachricht öffnen. Falls nicht, schreib an')} <a className="text-accent-300 underline" href="mailto:adrika.pradhan@usi.ch">adrika.pradhan@usi.ch</a>.</p>
              ) : (
                <form onSubmit={handleContactSubmit} className="grid gap-3 sm:grid-cols-2">
                  <label className="sr-only" htmlFor="contact-name">{t('Your name', 'Dein Name')}</label>
                  <input id="contact-name" type="text" required autoComplete="name" placeholder={t('Your name', 'Dein Name')} value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="min-h-12 rounded-2xl border border-white/10 bg-[#09090F] px-4 text-sm text-white outline-none transition-colors focus:border-accent-500" />
                  <label className="sr-only" htmlFor="contact-email">{t('Your email', 'Deine E-Mail-Adresse')}</label>
                  <input id="contact-email" type="email" required autoComplete="email" placeholder={t('Your email', 'Deine E-Mail-Adresse')} value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="min-h-12 rounded-2xl border border-white/10 bg-[#09090F] px-4 text-sm text-white outline-none transition-colors focus:border-accent-500" />
                  <label className="sr-only" htmlFor="contact-message">{t('Your message', 'Deine Nachricht')}</label>
                  <textarea id="contact-message" rows="4" required placeholder={t('Your message', 'Deine Nachricht')} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="contact-message rounded-2xl border border-white/10 bg-[#09090F] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent-500 sm:col-span-2" />
                  <button type="submit" className="tactile min-h-12 rounded-2xl bg-gradient-to-r from-accent-500 to-neon-600 font-mono text-xs font-bold text-white sm:col-span-2">{t('Open email draft ↗', 'E-Mail-Entwurf öffnen ↗')}</button>
                </form>
              )}
            </div>
          </details>
          <p className="font-mono text-[11px] text-slate-500"><a href="tel:+41767516652" className="hover:text-accent-300">+41 767516652</a> · Lugano, CH</p>
        </section>

      </div>

      {/* Global Page Footer */}
      <footer className="mt-20 border-t border-white/[0.08] bg-[#04060B] py-12 text-xs font-mono text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-bold text-white tracking-wider">ADRIKA PRADHAN</p>
            <p className="text-[11px] text-slate-500">
              {t('M.Sc. Artificial Intelligence · USI Lugano, Switzerland', 'M.Sc. Künstliche Intelligenz · USI Lugano, Schweiz')}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[11px]">
            <a href="#home" onClick={(e) => navigateToSection(e, 'home')} className="hover:text-accent-300 transition-colors">{t('Home', 'Start')}</a>
            <a href="#about" onClick={(e) => navigateToSection(e, 'about')} className="hover:text-accent-300 transition-colors">{t('About', 'Über mich')}</a>
            <a href="#skills" onClick={(e) => navigateToSection(e, 'skills')} className="hover:text-accent-300 transition-colors">{t('Skills', 'Kenntnisse')}</a>
            <a href="#projects" onClick={(e) => navigateToSection(e, 'projects')} className="hover:text-accent-300 transition-colors">{t('Projects', 'Projekte')}</a>
            <a href="#terminal" onClick={(e) => navigateToSection(e, 'terminal')} className="hover:text-accent-300 transition-colors">{t('Terminal', 'Konsole')}</a>
            <button type="button" onClick={() => setIsResumeOpen(true)} className="hover:text-accent-300 transition-colors">{t('Resume', 'Lebenslauf')}</button>
            <a href="#contact" onClick={(e) => navigateToSection(e, 'contact')} className="hover:text-accent-300 transition-colors">{t('Contact', 'Kontakt')}</a>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="https://github.com/adriennie" target="_blank" rel="noreferrer" className="hover:text-accent-300 transition-colors">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/adrika-pradhan-3a92622ba/" target="_blank" rel="noreferrer" className="hover:text-accent-300 transition-colors">LinkedIn ↗</a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
              className="text-accent-400 hover:text-accent-300 transition-colors ml-2"
            >
              ↑ {t('Top', 'Nach oben')}
            </button>
          </div>
        </div>
      </footer>

      {/* Resume Modal */}
      <AnimatePresence>
        {isResumeOpen && (
          <motion.div 
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            role="presentation"
            onClick={() => setIsResumeOpen(false)}
          >
            <motion.div 
              initial={reducedMotion ? false : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="resume-modal-title"
              onKeyDown={(event) => {
                if (event.key !== 'Tab') return;
                const focusable = event.currentTarget.querySelectorAll('button, a[href]');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
              }}
              className="bg-[#0B0F1A] border border-accent-500/30 rounded-3xl max-w-5xl w-full p-6 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-accent-950/60 pb-4">
                <div>
                  <h3 id="resume-modal-title" className="text-xl font-bold text-white">{t('Adrika Pradhan — Resume', 'Adrika Pradhan — Lebenslauf')}</h3>
                  <p className="text-xs text-accent-400 font-mono mt-0.5">{t('M.Sc. Artificial Intelligence, USI Lugano', 'M.Sc. Künstliche Intelligenz, USI Lugano')}</p>
                </div>
                <button 
                  autoFocus
                  type="button"
                  aria-label={t('Close résumé', 'Lebenslauf schließen')}
                  onClick={() => setIsResumeOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-[#0E1322] transition-colors"
                >
                  ✕
                </button>
              </div>

              <iframe src={`${BASE_URL}resume.pdf#view=FitH`} title={t('Adrika Pradhan resume PDF', 'Lebenslauf von Adrika Pradhan als PDF')} className="h-[65vh] w-full rounded-xl bg-white" />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-accent-950/60">
                <button 
                  type="button"
                  onClick={() => setIsResumeOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  {t('Close', 'Schließen')}
                </button>
                <a 
                  href={`${BASE_URL}resume.pdf`} 
                  download 
                  className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-accent-500 text-slate-950 font-bold hover:bg-accent-400 transition-colors flex items-center gap-2"
                >
                  {t('Download PDF ↗', 'PDF herunterladen ↗')}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
