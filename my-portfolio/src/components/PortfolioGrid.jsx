import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { timelineEvents } from '../data/timeline.js';
import PortfolioTerminal from './PortfolioTerminal.jsx';
import profilePhoto from '../assets/image.png';

const BASE_URL = `${import.meta.env.BASE_URL}/`;

export function HeroProfileCard() {
  const [showAddedPhoto, setShowAddedPhoto] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const interval = window.setInterval(() => setShowAddedPhoto((showing) => !showing), 3000);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="relative mx-auto flex h-[390px] w-full max-w-[430px] items-end justify-center sm:h-[480px] lg:h-[560px]">
      <div className="absolute bottom-8 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-600/20 blur-[90px] sm:h-96 sm:w-96" />
      <div className="absolute bottom-8 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full border border-pink-400/30 bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-transparent sm:h-96 sm:w-96" />
      <div className="relative z-10 mb-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setShowAddedPhoto((showing) => !showing)}
          aria-label={showAddedPhoto ? 'Show profile picture' : 'Show added portrait'}
          aria-pressed={showAddedPhoto}
          className="group h-72 w-72 rounded-full text-left outline-none focus-visible:ring-4 focus-visible:ring-pink-300/80 sm:h-96 sm:w-96"
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
              className="absolute inset-0 h-full w-full rounded-full border-2 border-pink-400/60 bg-[#0B0F1A] object-cover shadow-[0_0_40px_rgba(236,72,153,0.3)] [backface-visibility:hidden]"
              style={{ backfaceVisibility: 'hidden' }}
            />
            <img
              src={profilePhoto.src}
              alt="Adrika Pradhan in a red outfit"
              width={profilePhoto.width}
              height={profilePhoto.height}
              decoding="async"
              loading="lazy"
              className="absolute inset-0 h-full w-full rounded-full border-2 border-pink-400/60 bg-[#0B0F1A] object-cover object-[center_38%] shadow-[0_0_40px_rgba(236,72,153,0.3)] [backface-visibility:hidden]"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            />
          </span>
        </button>
      </div>
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
  const [typedHeroTagline, setTypedHeroTagline] = useState('');
  const [showMoreProjects, setShowMoreProjects] = useState(false);
  const reducedMotion = useReducedMotion();
  const t = (english, german) => language === 'de' ? german : english;
  const heroTagline = t('No one is better; some simply work smarter and harder.', 'Niemand ist besser; manche arbeiten einfach cleverer und härter.');
  const sectionLabels = language === 'de'
    ? { home: 'Start', about: 'Über mich', skills: 'Kenntnisse', certificates: 'Auszeichnungen', projects: 'Projekte', terminal: 'Konsole', contact: 'Kontakt' }
    : { home: 'Home', about: 'About', skills: 'Skills', certificates: 'Certificates', projects: 'Projects', terminal: 'Terminal', contact: 'Contact' };
  const commandItems = [
    { label: t('Home', 'Startseite'), keywords: 'home start hero', href: '#home' },
    { label: t('About me', 'Über mich'), keywords: 'about biography profile', href: '#about' },
    { label: t('Skills', 'Kenntnisse'), keywords: 'skills tools technology', href: '#skills' },
    { label: t('Certificates & achievements', 'Zertifikate & Auszeichnungen'), keywords: 'certificates awards', href: '#certificates' },
    { label: t('Projects', 'Projekte'), keywords: 'work portfolio', href: '#projects' },
    { label: t('More projects (products & platforms)', 'Weitere Projekte (Produkte & Plattformen)'), keywords: 'more projects products platforms ecoshare swasthya', action: 'more-projects', href: '#more-projects-heading' },
    { label: 'Log Triage Assistant', keywords: 'log triage anomaly detection observability trustworthy ai', href: `${BASE_URL}projects/log-triage` },
    { label: 'vLLM PagedAttention & Hugging Face Unified Benchmark Suite', keywords: 'inference vllm benchmark', href: `${BASE_URL}projects/vllm-pagedattention-benchmark` },
    { label: 'vLLM LoRA Extension', keywords: 'lora adapter vllm', href: `${BASE_URL}projects/vllm-lora-extension` },
    { label: 'Swasthya Pharmacy Network', keywords: 'swasthya pharmacy health', href: `${BASE_URL}projects/swasthya` },
    { label: 'EcoShare', keywords: 'ecoshare community marketplace', href: `${BASE_URL}projects/ecoshare` },
    { label: t('Research console', 'Forschungskonsole'), keywords: 'terminal research', href: '#terminal' },
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
      'Astronomical Denoising Research': 'Forschung zur astronomischen Entrauschung',
    }[highlight] || highlight)),
  })) : timelineEvents;

  useEffect(() => {
    if (reducedMotion) {
      setTypedHeroTagline(heroTagline);
      return undefined;
    }

    setTypedHeroTagline('');
    let characterIndex = 0;
    const timer = window.setInterval(() => {
      characterIndex += 1;
      setTypedHeroTagline(heroTagline.slice(0, characterIndex));
      if (characterIndex >= heroTagline.length) window.clearInterval(timer);
    }, 55);

    return () => window.clearInterval(timer);
  }, [heroTagline, reducedMotion]);

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
    if (item.action === 'more-projects') {
      setIsPaletteOpen(false);
      setShowMoreProjects(true);
      window.requestAnimationFrame(() => {
        document.getElementById('more-projects-heading')?.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${t('Portfolio message from', 'Portfolionachricht von')} ${contactForm.name}`);
    const body = encodeURIComponent(`${contactForm.message}\n\nFrom: ${contactForm.name}\nReply to: ${contactForm.email}`);
    window.location.href = `mailto:adrika.pradhan@usi.ch?subject=${subject}&body=${body}`;
    setEmailDraftRequested(true);
  };

  return (
      <div lang={language} className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-pink-500/30 selection:text-pink-200 relative overflow-x-clip">
      
      {/* Ambient Pink Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-pink-600/10 rounded-full blur-[160px] pointer-events-none"></div>

      <a className="skip-link" href="#home">{t('Skip to content', 'Zum Inhalt springen')}</a>

      {/* Floating Pill Navigation Bar */}
      <div className="site-navigation sticky top-3 z-50 px-4">
        <nav className="mx-auto flex max-w-fit items-center justify-between gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2.5 text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:gap-4 sm:px-5 sm:py-3 lg:gap-5">
          <span className="font-extrabold tracking-[0.14em] text-sm font-mono text-white">ADRIKA</span>
          <div className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-6 text-xs font-semibold tracking-wide">
            {Object.entries(sectionLabels).map(([tab, label]) => (
              <a 
                key={tab} 
                href={`#${tab}`}
                onClick={(event) => navigateToSection(event, tab)}
                aria-current={activeNav === tab ? 'location' : undefined}
                className={`uppercase transition-colors duration-200 hover:text-pink-200 ${activeNav === tab ? 'text-white font-bold' : 'text-slate-300'}`}
              >
                {label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
            aria-label={language === 'en' ? 'Sprache auf Deutsch umstellen' : 'Switch language to English'}
            aria-pressed={language === 'de'}
            className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-2 text-[10px] font-mono font-semibold tracking-wide text-slate-200 transition-colors hover:bg-white/[0.12] sm:px-3"
          >
            {language === 'en' ? 'DE' : 'EN'}
          </button>
          <button
            type="button"
            onClick={() => { setIsPaletteOpen(true); setIsMobileMenuOpen(false); setPaletteQuery(''); }}
            aria-label={t('Open command palette', 'Befehlspalette öffnen')}
            aria-keyshortcuts="Control+K Meta+K"
            className="hidden xl:inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-[10px] font-mono text-slate-300 transition-colors hover:bg-white/[0.12] hover:text-white"
          >
            <span>{t('⌘k', '⌘k')}</span>
          </button>
          <button
            type="button"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-lg font-medium leading-none text-white transition-all duration-200 hover:border-white/30 hover:bg-white/[0.12] sm:h-10 sm:w-10"
            aria-label={isMobileMenuOpen ? t('Close navigation menu', 'Navigationsmenü schließen') : t('Open navigation menu', 'Navigationsmenü öffnen')}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? '×' : '☰'}
          </button>
          <button 
            onClick={() => setIsResumeOpen(true)}
            className="rounded-full border border-pink-200/20 bg-gradient-to-b from-pink-400 to-pink-600 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_5px_18px_rgba(236,72,153,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(236,72,153,0.35)] sm:px-5"
          >
            {t('CV', 'Lebenslauf')}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
              initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-md" />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={t('Site navigation', 'Seitennavigation')}
              initial={reducedMotion ? false : { x: '-100%' }}
              animate={{ x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { x: '-100%' }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 34 }}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key !== 'Tab') return;
                const focusable = event.currentTarget.querySelectorAll('button, a[href]');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
              }}
              className="relative flex h-full w-[min(19rem,84vw)] flex-col overflow-hidden border-r border-white/15 bg-gradient-to-br from-white/[0.12] via-[#0B0F1A]/80 to-pink-950/55 p-6 shadow-[20px_0_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="font-mono text-sm font-bold tracking-[0.18em] text-white">ADRIKA</p>
                  <p className="mt-2 text-[11px] text-slate-400">M.Sc. AI · USI Lugano</p>
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label={t('Close navigation menu', 'Navigationsmenü schließen')}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-lg text-slate-300 transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="mb-3 mt-7 flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-pink-300">{t('Navigate', 'Navigation')}</p>
                <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIsPaletteOpen(true); setPaletteQuery(''); }} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-mono text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white">⌘K / Ctrl K</button>
              </div>
              <nav className="flex flex-col gap-1" aria-label={t('Mobile navigation', 'Mobile Navigation')}>
                {Object.entries(sectionLabels).map(([tab, label], index) => (
                  <motion.a
                    key={tab}
                    href={`#${tab}`}
                    onClick={(event) => navigateToSection(event, tab)}
                    aria-current={activeNav === tab ? 'location' : undefined}
                    initial={reducedMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reducedMotion ? 0 : 0.04 + index * 0.035, duration: reducedMotion ? 0 : 0.2 }}
                    className={`flex min-h-11 items-center gap-3 rounded-xl border border-transparent px-3 text-sm font-mono uppercase tracking-wide transition-all duration-200 ${activeNav === tab ? 'border-white/10 bg-white/[0.09] text-white shadow-inner shadow-white/[0.04]' : 'text-slate-300 hover:border-white/[0.07] hover:bg-white/[0.05] hover:text-white'}`}
                  >
                    <span className="w-5 text-[10px] text-pink-400/70">0{index + 1}</span>
                    {label}
                  </motion.a>
                ))}
              </nav>
              <div className="mt-auto border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => { setIsMobileMenuOpen(false); setIsResumeOpen(true); }}
                  className="w-full rounded-xl border border-white/15 bg-gradient-to-b from-pink-400 to-pink-600 px-4 py-3 text-xs font-semibold text-white shadow-[0_8px_24px_rgba(236,72,153,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(236,72,153,0.3)]"
                >
                  {t('View Resume / CV ↗', 'Lebenslauf ansehen ↗')}
                </button>
              </div>
            </motion.aside>
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
                <span aria-hidden="true" className="text-lg text-pink-300">⌕</span>
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
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition-colors ${selectedCommand === index ? 'bg-pink-400/10 text-white' : 'text-slate-300 hover:bg-white/[0.05]'}`}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24 pt-8 sm:pt-12 pb-16 sm:pb-24 relative z-10">
        
        {/* SECTION: HOME / HERO */}
        <section id="home" className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 items-center lg:min-h-[75vh] scroll-mt-28">
          <div className="min-w-0 space-y-5 sm:space-y-6 py-4 sm:py-8 lg:py-0">
            <span className="text-pink-300 font-mono text-xs uppercase tracking-[0.22em]">ADRIKA PRADHAN</span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              🌸 {t('Hi, I’m', 'Hallo, ich bin')} <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Adrika</span>
            </h1>
            <div className="min-h-[3rem] sm:min-h-[3.75rem] flex items-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-pink-400 font-mono" aria-label={heroTagline}>
                <span aria-hidden="true">{typedHeroTagline}<span className="animate-pulse">▍</span></span>
                <span className="sr-only">{heroTagline}</span>
              </h2>
            </div>
            <p className="text-slate-300/80 text-sm sm:text-base leading-7 max-w-xl">
              {t('M.Sc. Artificial Intelligence student at USI Lugano, working across LLM inference optimization, LoRA serving, and deep learning for scientific data. I like turning careful experiments into practical, resource-aware systems.', 'Masterstudentin der Künstlichen Intelligenz an der USI Lugano. Meine Arbeit umfasst die Optimierung der LLM-Inferenz, das Bereitstellen von LoRA-Adaptern und Deep Learning für wissenschaftliche Daten. Ich mache aus sorgfältigen Experimenten praktische, ressourcenschonende Systeme.')}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => setIsResumeOpen(true)}
                className="px-6 py-3 rounded-full text-xs font-bold font-mono bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>↓</span> {t('View Resume / CV', 'Lebenslauf ansehen')}
              </button>
              <div className="flex items-center gap-3">
                <a aria-label="GitHub" href="https://github.com/adriennie" target="_blank" rel="noreferrer" className="px-4 py-3 rounded-full bg-[#0E1322] border border-white/10 text-slate-200 hover:border-pink-500/50 hover:text-pink-300 transition-all">
                  GitHub
                </a>
                <a aria-label="LinkedIn" href="https://www.linkedin.com/in/adrika-pradhan-3a92622ba/" target="_blank" rel="noreferrer" className="px-4 py-3 rounded-full bg-[#0E1322] border border-white/10 text-slate-200 hover:border-pink-500/50 hover:text-pink-300 transition-all">
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {(language === 'de' ? ['M.Sc. KI @ USI · Lugano, CH', 'Englisch · B2', 'Deutsch · A1, im Lernprozess'] : ['M.Sc. AI @ USI · Lugano, CH', 'English · B2', 'German · A1, learning']).map((badge) => (
                <span key={badge} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-mono text-slate-400">{badge}</span>
              ))}
            </div>
            <aside className="max-w-xl rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl sm:p-5" aria-label={t('Currently', 'Aktuell')}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-pink-300">{t('Currently', 'Aktuell')}</p>
                <span className="inline-flex items-center gap-2 text-[10px] font-mono text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{t('Open to opportunities', 'Offen für Möglichkeiten')}</span>
              </div>
              <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                <div><p className="text-slate-500">{t('Focus', 'Schwerpunkte')}</p><p className="mt-1 leading-relaxed text-slate-200">LLM inference · LoRA serving · Applied AI</p></div>
                <div><p className="text-slate-500">{t('Seeking', 'Gesucht')}</p><p className="mt-1 leading-relaxed text-slate-200">{t('Research collaborations and technical studentships', 'Forschungskooperationen und technische Studierendenstellen')}</p></div>
              </div>
              <p className="mt-3 text-[10px] font-mono text-slate-500">{t('Lugano, Switzerland · USI', 'Lugano, Schweiz · USI')}</p>
            </aside>
          </div>

          <div className="flex justify-center relative lg:self-end">
            <HeroProfileCard />
          </div>

          <div className="lg:col-span-2 -mx-6 mt-2 border-y border-pink-400/10 bg-gradient-to-r from-pink-950/40 via-[#111827]/90 to-rose-950/40 px-6 py-5 sm:py-6">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Tools I work with</span>
              {['Python', 'PyTorch', 'vLLM', 'Hugging Face', 'Google Cloud', 'PostgreSQL'].map((tool) => (
                <span key={tool} className="text-xs sm:text-sm font-semibold tracking-wide text-slate-300/80">{tool}</span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: ABOUT ME */}
        <section id="about" className="space-y-10 pt-12 scroll-mt-28">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-mono uppercase tracking-[0.24em] text-pink-400">{t('A little about me', 'Über mich')}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('Curious about AI. Focused on', 'Neugierig auf KI. Mit Fokus auf')} <span className="text-pink-400">{t('useful impact.', 'praktischen Nutzen.')}</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              {t('My work sits at the intersection of machine learning research and practical engineering—from scientific imaging to efficient language models.', 'Meine Arbeit verbindet Machine-Learning-Forschung mit praktischer Entwicklung – von wissenschaftlicher Bildverarbeitung bis zu effizienten Sprachmodellen.')}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-pink-400/20 bg-gradient-to-r from-pink-500/[0.08] via-[#0B0F1A]/90 to-[#0B0F1A]/90 p-6 sm:p-7">
            <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-pink-300">{t('Open science · Research transparency', 'Open Science · Forschungstransparenz')}</p>
                <p className="text-sm leading-relaxed text-slate-300">{t('The vLLM project publishes notebooks, CSV results, and plots. I document experimental limits too: runtime versions were not pinned, GPU memory was not captured, and the astronomy detection labels were placeholders.', 'Das vLLM-Projekt enthält Notebooks, CSV-Ergebnisse und Diagramme. Ich dokumentiere auch die Grenzen der Experimente: Laufzeitversionen waren nicht festgeschrieben, der GPU-Speicher wurde nicht erfasst und die Labels der astronomischen Detektion waren Platzhalter.')}</p>
              </div>
              <div className="relative flex flex-wrap gap-2">
                <a href="https://github.com/adriennie/vllm-pagedattention-benchmark" target="_blank" rel="noreferrer" className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-2 text-xs font-mono text-pink-300 transition-colors hover:bg-pink-500/20">{t('Benchmark artifacts ↗', 'Benchmark-Artefakte ↗')}</a>
                <a href="https://github.com/adriennie/Astronomical-Image-Processing" target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-mono text-slate-300 transition-colors hover:border-pink-500/30">{t('Research repository ↗', 'Forschungsrepository ↗')}</a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 relative overflow-hidden p-7 sm:p-9 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] via-[#0B0F1A] to-[#15101c] shadow-2xl shadow-black/20">
              <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
              <div className="relative space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-400/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-pink-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" /> {t('M.Sc. Artificial Intelligence · USI Lugano', 'M.Sc. Künstliche Intelligenz · USI Lugano')}
                </span>
                <p className="text-slate-300 text-sm sm:text-base leading-7">
                  {t('I’m an AI graduate student who enjoys turning complex problems into systems people can use. I’ve evaluated deep-learning models on noisy astronomy data, explored ways to make LLM inference and fine-tuning more efficient on limited GPUs, and built RAG prototypes during my Generative AI internship with NASSCOM FutureSkills.', 'Ich studiere Künstliche Intelligenz und setze mich gern damit auseinander, komplexe Probleme in nutzbare Systeme zu verwandeln. Ich habe Deep-Learning-Modelle auf verrauschten astronomischen Daten ausgewertet, effiziente LLM-Inferenz und Feinabstimmung auf begrenzten GPUs untersucht und während meines Praktikums bei NASSCOM FutureSkills RAG-Prototypen entwickelt.')}
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
                { value: '0.69', label: t('IoU · placeholder labels', 'IoU · Platzhalter-Labels'), detail: t('Astronomy study', 'Astronomische Studie') },
                { value: '7.91', label: 'B.Tech CGPA', detail: t('Computer Science · AI & ML', 'Informatik · KI & ML') },
                { value: 'AI-102', label: t('Azure AI Engineer', 'Azure AI Engineer'), detail: t('Microsoft certified', 'Microsoft-Zertifizierung') },
              ].map((stat) => (
                <div key={stat.label} className="min-h-32 flex flex-col justify-between p-5 rounded-2xl border border-white/10 bg-[#0B0F1A]/80 hover:border-pink-400/30 transition-colors">
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
              <span className="flex-none w-10 h-10 rounded-xl bg-pink-400/10 text-pink-300 flex items-center justify-center text-lg">✳</span>
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

          {/* Education Timeline */}
          <div className="pt-8 space-y-6">
            <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span>
              {t('Academic Journey & Experience', 'Ausbildung & Erfahrung')}
            </h3>
            <div className="relative max-w-4xl">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-pink-400/70 via-pink-500/30 to-transparent" />
              <div className="space-y-6">
                {localizedTimelineEvents.map((event, idx) => (
                  <article key={idx} className="relative pl-9 sm:pl-12">
                    <span className="absolute left-0 top-6 flex h-4 w-4 items-center justify-center rounded-full border border-pink-300/50 bg-[#06080F] shadow-[0_0_16px_rgba(244,114,182,0.25)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                    </span>
                    <div className="rounded-2xl border border-white/10 bg-[#0B0F1A]/75 p-5 sm:p-6 backdrop-blur-xl transition-colors hover:border-pink-400/30">
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="inline-flex w-fit rounded-full bg-pink-400/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-pink-300">{event.type}</span>
                        <span className="text-xs font-mono text-slate-400">{event.period}</span>
                      </div>
                      <h4 className="text-lg font-bold text-white">{event.title}</h4>
                      <p className="mt-1 text-xs font-mono text-slate-400">{event.organization}</p>
                      <p className="mt-3 text-xs leading-relaxed text-slate-400">{event.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {event.highlights.map((h, hIdx) => (
                          <span key={hIdx} className="rounded-full border border-white/10 bg-[#0E1322] px-2.5 py-1 text-[10px] font-mono text-slate-300">{h}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SKILLS */}
        <section id="skills" className="space-y-12 pt-12 scroll-mt-28">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              🌸 {t('Core', 'Zentrale')} <span className="text-pink-400">{t('Skills', 'Kenntnisse')}</span>
            </h2>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">{t('Technical stack & competencies', 'Technologien & Kompetenzen')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            {skillGroups.map((group) => (
              <div key={group.name} className="p-6 rounded-3xl border border-white/10 bg-[#0B0F1A]/80 backdrop-blur-xl space-y-4">
                <h3 className="text-sm font-semibold font-mono text-white">{language === 'de' ? ({ Programming: 'Programmierung', 'Machine Learning': 'Maschinelles Lernen', 'LLM Engineering': 'LLM-Entwicklung', 'Data & Platforms': 'Daten & Plattformen' }[group.name]) : group.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span key={skill} className="rounded-full border border-pink-500/15 bg-pink-500/[0.06] px-3 py-1.5 text-xs text-slate-300">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: CERTIFICATES & ACHIEVEMENTS */}
        <section id="certificates" className="space-y-12 pt-12 scroll-mt-28">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              🌸 {t('Certificates &', 'Zertifikate &')} <span className="text-pink-400">{t('Achievements', 'Auszeichnungen')}</span>
            </h2>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">{t('Professional credentials and competitive awards', 'Berufliche Zertifikate und Wettbewerbserfolge')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="p-6 rounded-3xl border border-pink-950/80 bg-[#0B0F1A]/80 backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-bold text-pink-400 font-mono">{t('Certificates', 'Zertifikate')}</h3>
              <div className="space-y-3">
                {certificatesList.map((cert, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0E1322] border border-pink-500/20 text-xs space-y-1">
                    <div className="font-bold text-white">{cert.name}</div>
                    <div className="text-slate-400 font-mono flex items-center justify-between gap-2">
                      <span>{cert.issuer} · {cert.date}</span>
                      {cert.credential && (
                        <span className="text-[10px] text-pink-300/90 font-mono">ID: {cert.credential}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-pink-950/80 bg-[#0B0F1A]/80 backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-bold text-pink-400 font-mono">{t('Achievements & Hackathons', 'Auszeichnungen & Hackathons')}</h3>
              <div className="space-y-3">
                {achievementsList.map((ach, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0E1322] border border-pink-500/20 text-xs space-y-1">
                    <div className="font-bold text-white">{ach.title}</div>
                    <div className="text-slate-400 font-mono">{language === 'de' ? (idx === 0 ? 'Runde 2 erreicht (Rang: 2083 / 6138)' : idx === 1 ? 'Nationales Halbfinale' : 'Finalistin; Innovationsförderung in Höhe von ₹50.000 erhalten') : ach.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PROJECTS (Chronological Order) */}
        <section id="projects" className="space-y-12 pt-12 scroll-mt-28">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              🌸 {t('Selected', 'Ausgewählte')} <span className="text-pink-400">{t('Projects', 'Projekte')}</span>
            </h2>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">{t('Chronological engineering & research milestones', 'Ausgewählte Projekte aus Entwicklung und Forschung')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* 1. Log Triage Assistant (2026) */}
            <div className="group rounded-3xl border border-pink-500/20 bg-[#0B0F1A]/80 p-6 backdrop-blur-xl hover:border-pink-400/50 flex flex-col justify-between shadow-2xl transition-all hover:-translate-y-1 h-full">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 min-h-[1.75rem]">
                  <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block">{t('RECENT · OBSERVABILITY (2026)', 'AKTUELL · OBSERVABILITY (2026)')}</span>
                  <span className="rounded-full border border-pink-400/30 bg-pink-400/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-pink-300">
                    ⚡ 5,781 lines/s · 0% hallucination
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors min-h-[3.5rem] flex items-start">Log Triage Assistant</h3>
                <p className="text-xs text-slate-300 leading-relaxed min-h-[3.75rem] sm:min-h-[4rem]">
                  {t('Streaming anomaly detection with trace-aware logs and citation guardrails: 5,781.4 lines/s, 0% citation hallucination rate, and 93.1% lower feature-scoring memory.', 'Streaming-Anomalieerkennung mit Trace-aware Logs und Zitations-Guardrails: 5.781,4 Zeilen/s, 0 % Zitations-Halluzinationsrate und 93,1 % weniger Speicher beim Feature-Scoring.')}
                </p>
              </div>
              <div className="pt-6 space-y-4 mt-auto">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-pink-300 min-h-[1.75rem] items-center">
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">Python · FastAPI</span>
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">OpenTelemetry</span>
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">Drain3</span>
                </div>
                <a href={`${BASE_URL}projects/log-triage`} className="block text-center w-full py-2.5 rounded-xl text-xs font-mono font-bold bg-pink-500/10 text-pink-300 border border-pink-400/30 hover:bg-pink-500/20 hover:text-white transition-all">
                  {t('View Results & Architecture ↗', 'Ergebnisse & Architektur ansehen ↗')}
                </a>
              </div>
            </div>

            {/* 2. vLLM PagedAttention & Hugging Face Unified Benchmark Suite (2026) */}
            <div className="group rounded-3xl border border-pink-500/20 bg-[#0B0F1A]/80 p-6 backdrop-blur-xl hover:border-pink-400/50 flex flex-col justify-between shadow-2xl transition-all hover:-translate-y-1 h-full">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 min-h-[1.75rem]">
                  <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block">{t('INFERENCE OPTIMIZATION (2026)', 'INFERENZOPTIMIERUNG (2026)')}</span>
                  <span className="rounded-full border border-pink-400/30 bg-pink-400/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-pink-300">
                    🚀 5.06× throughput (BS=32)
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors min-h-[3.5rem] flex items-start">vLLM PagedAttention & Hugging Face Unified Benchmark Suite</h3>
                <p className="text-xs text-slate-300 leading-relaxed min-h-[3.75rem] sm:min-h-[4rem]">
                  {t('At batch 32, vLLM measured 5.06x the Transformers row and 1.43x a separate generate() row.', 'Bei Batch 32 erreichte vLLM das 5,06-Fache des Transformers-Laufs und das 1,43-Fache eines separaten generate()-Laufs.')}
                </p>
              </div>
              <div className="pt-6 space-y-4 mt-auto">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-pink-300 min-h-[1.75rem] items-center">
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">vLLM</span>
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">PyTorch</span>
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">Tesla T4</span>
                </div>
                <a href={`${BASE_URL}projects/vllm-pagedattention-benchmark`} className="block text-center w-full py-2.5 rounded-xl text-xs font-mono font-bold bg-pink-500/10 text-pink-300 border border-pink-400/30 hover:bg-pink-500/20 hover:text-white transition-all">
                  {t('View Details & Architecture ↗', 'Details & Architektur ansehen ↗')}
                </a>
              </div>
            </div>

            {/* 3. vLLM LoRA Extension (2026) */}
            <div className="group rounded-3xl border border-pink-500/20 bg-[#0B0F1A]/80 p-6 backdrop-blur-xl hover:border-pink-400/50 flex flex-col justify-between shadow-2xl transition-all hover:-translate-y-1 h-full">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 min-h-[1.75rem]">
                  <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block">PEFT & ADAPTER-ROUTING (2026)</span>
                  <span className="rounded-full border border-pink-400/30 bg-pink-400/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-pink-300">
                    ⚙️ 3 adapters · 1 engine
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors min-h-[3.5rem] flex items-start">LoRA Rank Ablation & Multi-Adapter Evaluation with PEFT</h3>
                <p className="text-xs text-slate-300 leading-relaxed min-h-[3.75rem] sm:min-h-[4rem]">
                  {t('Trained LoRA adapters (ranks 4, 8, 16) and served all three adapters from one vLLM engine using LoraRequest routing.', 'LoRA-Adapter (Ränge 4, 8, 16) trainiert und alle drei über eine vLLM-Engine mit LoraRequest-Routing bereitgestellt.')}
                </p>
              </div>
              <div className="pt-6 space-y-4 mt-auto">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-pink-300 min-h-[1.75rem] items-center">
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">PEFT</span>
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">LoRA</span>
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">vLLM</span>
                </div>
                <a href={`${BASE_URL}projects/vllm-lora-extension`} className="block text-center w-full py-2.5 rounded-xl text-xs font-mono font-bold bg-pink-500/10 text-pink-300 border border-pink-400/30 hover:bg-pink-500/20 hover:text-white transition-all">
                  {t('View Details & Architecture ↗', 'Details & Architektur ansehen ↗')}
                </a>
              </div>
            </div>

            {/* 4. Astronomical Denoising Research (2024 - 2025) */}
            <div className="group rounded-3xl border border-pink-500/20 bg-[#0B0F1A]/80 p-6 backdrop-blur-xl hover:border-pink-400/50 flex flex-col justify-between shadow-2xl transition-all hover:-translate-y-1 h-full">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 min-h-[1.75rem]">
                  <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block">{t('DEEP LEARNING RESEARCH (2024 – 2025)', 'DEEP-LEARNING-FORSCHUNG (2024 – 2025)')}</span>
                  <span className="rounded-full border border-pink-400/30 bg-pink-400/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-pink-300">
                    🔭 27.52 dB PSNR · 0.88 SSIM
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors min-h-[3.5rem] flex items-start">Denoising Astronomical Images with CAE for YOLO Detection</h3>
                <p className="text-xs text-slate-300 leading-relaxed min-h-[3.75rem] sm:min-h-[4rem]">
                  {t('Reported 27.52 dB PSNR and 0.88 SSIM. The 0.51 to 0.69 mean IoU comparison used placeholder labels.', 'Berichtet wurden 27,52 dB PSNR und 0,88 SSIM. Der mittlere IoU-Vergleich von 0,51 auf 0,69 nutzte Platzhalter-Labels.')}
                </p>
              </div>
              <div className="pt-6 space-y-4 mt-auto">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-pink-300 min-h-[1.75rem] items-center">
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">TensorFlow</span>
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">OpenCV</span>
                  <span className="px-2 py-0.5 rounded bg-[#0E1322] border border-pink-500/20">LaTeX</span>
                </div>
                <a href={`${BASE_URL}projects/astronomical-image-processing`} className="block text-center w-full py-2.5 rounded-xl text-xs font-mono font-bold bg-pink-500/10 text-pink-300 border border-pink-400/30 hover:bg-pink-500/20 hover:text-white transition-all">
                  {t('View Details & Architecture ↗', 'Details & Architektur ansehen ↗')}
                </a>
              </div>
            </div>

          </div>

          <div id="more-projects-controls" className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setShowMoreProjects((prev) => !prev)}
              aria-expanded={showMoreProjects}
              aria-controls="more-projects-section"
              className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-[#0B0F1A]/90 px-6 py-3 text-xs font-mono font-bold text-pink-300 shadow-xl shadow-pink-950/40 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-400/60 hover:bg-pink-500/10 hover:text-white active:translate-y-0"
            >
              <span>{showMoreProjects ? t('Show fewer projects', 'Weniger Projekte anzeigen') : t('More projects', 'Weitere Projekte')}</span>
              <span className={`inline-block transition-transform duration-300 ${showMoreProjects ? 'rotate-180' : ''}`} aria-hidden="true">
                ↓
              </span>
            </button>
          </div>

          <AnimatePresence>
            {showMoreProjects && (
              <motion.div
                id="more-projects-section"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.25 }}
              >
                <section className="space-y-5 pt-4" aria-labelledby="more-projects-heading">
                  <div className="max-w-3xl space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-pink-400">{t('More projects', 'Weitere Projekte')}</p>
                    <h3 id="more-projects-heading" className="text-2xl font-extrabold tracking-tight text-white">
                      {t('Applied products and platforms', 'Angewandte Produkte und Plattformen')}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-400">
                      {t('A second shelf for product work beyond the featured research and systems projects.', 'Eine zweite Reihe für Produktarbeit neben den hervorgehobenen Forschungs- und Systemprojekten.')}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="group flex flex-col justify-between rounded-3xl border border-pink-500/20 bg-[#0B0F1A]/80 p-6 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-pink-400/50 h-full">
                      <div className="space-y-3">
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-pink-400">{t('COMMUNITY MARKETPLACE (2026)', 'COMMUNITY-MARKTPLATZ (2026)')}</span>
                        <h4 className="text-xl font-bold text-white transition-colors group-hover:text-pink-300 min-h-[3.5rem] flex items-start">EcoShare</h4>
                        <p className="text-xs leading-relaxed text-slate-400 min-h-[3.75rem] sm:min-h-[4rem]">{t('Mobile-first community marketplace for sharing items, managing orders, and transferring community credits.', 'Mobile-first Community-Marktplatz zum Teilen von Artikeln, Verwalten von Bestellungen und Übertragen von Community-Guthaben.')}</p>
                      </div>
                      <div className="space-y-4 pt-6 mt-auto">
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-pink-300 min-h-[1.75rem] items-center">
                          <span className="rounded border border-pink-500/20 bg-[#0E1322] px-2 py-0.5">Expo / React Native</span>
                          <span className="rounded border border-pink-500/20 bg-[#0E1322] px-2 py-0.5">Bun</span>
                          <span className="rounded border border-pink-500/20 bg-[#0E1322] px-2 py-0.5">Supabase · Clerk</span>
                        </div>
                        <a href={`${BASE_URL}projects/ecoshare`} className="block w-full rounded-xl border border-pink-400/30 bg-pink-500/10 py-2.5 text-center text-xs font-mono font-bold text-pink-300 transition-all hover:bg-pink-500/20 hover:text-white">{t('View project ↗', 'Projekt ansehen ↗')}</a>
                      </div>
                    </div>

                    <div className="group flex flex-col justify-between rounded-3xl border border-pink-500/20 bg-[#0B0F1A]/80 p-6 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-pink-400/50 h-full">
                      <div className="space-y-3">
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-pink-400">{t('PHARMACY NETWORK (2025 – 2026)', 'APOTHEKEN-NETZWERK (2025 – 2026)')}</span>
                        <h4 className="text-xl font-bold text-white transition-colors group-hover:text-pink-300 min-h-[3.5rem] flex items-start">Swasthya Pharmacy Network</h4>
                        <p className="text-xs leading-relaxed text-slate-400 min-h-[3.75rem] sm:min-h-[4rem]">{t('Role-based app for customer health tools, pharmacy inventory, distributor orders, and admin operations, with an external ML API integration.', 'Rollenbasierte App mit Gesundheitsfunktionen, Apothekenbestand, Händlerbestellungen und Admin-Prozessen sowie einer externen ML-API.')}</p>
                      </div>
                      <div className="space-y-4 pt-6 mt-auto">
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-pink-300 min-h-[1.75rem] items-center">
                          <span className="rounded border border-pink-500/20 bg-[#0E1322] px-2 py-0.5">Expo · TypeScript</span>
                          <span className="rounded border border-pink-500/20 bg-[#0E1322] px-2 py-0.5">Supabase</span>
                          <span className="rounded border border-pink-500/20 bg-[#0E1322] px-2 py-0.5">ML API</span>
                        </div>
                        <a href={`${BASE_URL}projects/swasthya`} className="block w-full rounded-xl border border-pink-400/30 bg-pink-500/10 py-2.5 text-center text-xs font-mono font-bold text-pink-300 transition-all hover:bg-pink-500/20 hover:text-white">{t('View project ↗', 'Projekt ansehen ↗')}</a>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreProjects(false);
                        document.getElementById('more-projects-controls')?.scrollIntoView({
                          behavior: reducedMotion ? 'auto' : 'smooth',
                          block: 'center',
                        });
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-[#0B0F1A]/90 px-5 py-2.5 text-xs font-mono font-bold text-pink-300 shadow-xl shadow-pink-950/40 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-400/60 hover:bg-pink-500/10 hover:text-white"
                    >
                      <span>{t('Show fewer projects', 'Weniger Projekte anzeigen')}</span>
                      <span aria-hidden="true">↑</span>
                    </button>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* SECTION: PORTFOLIO TERMINAL */}
        <section id="terminal" className="space-y-8 pt-12 scroll-mt-28">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-mono uppercase tracking-[0.24em] text-pink-400">{t('Research console · interactive portfolio', 'Forschungskonsole · interaktives Portfolio')}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t('Explore the work,', 'Entdecke die Arbeit,')} <span className="text-pink-400">{t('with evidence.', 'mit Belegen.')}</span></h2>
            <p className="text-sm text-slate-400 leading-relaxed">{t('Explore research interests, benchmark context, experiment limits, and selected projects through concise commands.', 'Erkunde Forschungsschwerpunkte, Benchmark-Kontext, Grenzen der Experimente und ausgewählte Projekte mit kurzen Befehlen.')}</p>
          </div>
          <div className="max-w-4xl">
            <PortfolioTerminal
              language={language}
              onOpenResume={() => setIsResumeOpen(true)}
              onNavigate={(section) => navigateToSection(null, section)}
              onLanguageChange={(lang) => setLanguage(lang)}
            />
          </div>
        </section>

        {/* SECTION: CONTACT */}
        <section id="contact" className="space-y-12 pt-12 scroll-mt-28">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              🌸 {t('Get in', 'Kontaktiere')} <span className="text-pink-400">{t('Touch', 'mich')}</span>
            </h2>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">{t('Get in touch with me', 'Schreib mir gern')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl">
            <div className="hidden lg:flex justify-center">
              <div className="max-w-xs space-y-4 rounded-3xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-[#0B0F1A] p-8 shadow-2xl shadow-pink-950/30">
                <span className="text-3xl text-pink-300">✉</span>
                <h3 className="text-xl font-bold text-white">{t('Let’s talk about AI.', 'Lass uns über KI sprechen.')}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{t('Open to research, engineering, and technical studentship opportunities.', 'Offen für Forschungs-, Entwicklungs- und technische Studierendenstellen.')}</p>
                <a href="mailto:adrika.pradhan@usi.ch" className="inline-block text-sm font-mono text-pink-300 hover:text-pink-200">adrika.pradhan@usi.ch ↗</a>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-pink-950/80 bg-[#0B0F1A]/80 backdrop-blur-xl shadow-2xl">
              {emailDraftRequested ? (
                  <div className="py-12 text-center space-y-3">
                  <div className="text-4xl text-pink-300">✉</div>
                  <h3 className="text-xl font-bold text-white">{t('Email draft requested', 'E-Mail-Entwurf vorbereitet')}</h3>
                  <p className="text-xs text-slate-400">{t('Your email app should open with the message ready. If it didn’t, email', 'Dein E-Mail-Programm sollte sich mit der Nachricht öffnen. Falls nicht, schreib an')} <a className="text-pink-300 underline" href="mailto:adrika.pradhan@usi.ch">adrika.pradhan@usi.ch</a>.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="sr-only" htmlFor="contact-name">{t('Your name', 'Dein Name')}</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      required
                      autoComplete="name"
                      placeholder={t('Your Name', 'Dein Name')} 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#06080F] border border-pink-950 text-white text-xs font-mono focus:border-pink-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="contact-email">{t('Your email', 'Deine E-Mail-Adresse')}</label>
                    <input 
                      id="contact-email"
                      type="email" 
                      required
                      autoComplete="email"
                      placeholder={t('Your Email', 'Deine E-Mail-Adresse')} 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#06080F] border border-pink-950 text-white text-xs font-mono focus:border-pink-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="contact-message">{t('Your message', 'Deine Nachricht')}</label>
                    <textarea 
                      id="contact-message"
                      rows="4" 
                      required
                      placeholder={t('Your Message', 'Deine Nachricht')} 
                      value={contactForm.message}
                      onChange={(e) => {
                        setContactForm({ ...contactForm, message: e.target.value });
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      className="contact-message w-full overflow-x-hidden overflow-y-hidden px-4 py-3 rounded-2xl bg-[#06080F] border border-pink-950 text-white text-xs font-mono focus:border-pink-500 outline-none transition-colors resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 rounded-2xl font-bold font-mono text-xs bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30 hover:scale-[1.02] transition-all"
                  >
                    {t('Open email draft ↗', 'E-Mail-Entwurf öffnen ↗')}
                  </button>
                  <div className="pt-4 border-t border-pink-950 flex flex-wrap justify-between text-[11px] font-mono text-slate-400">
                    <a href="mailto:adrika.pradhan@usi.ch" className="hover:text-pink-300">adrika.pradhan@usi.ch</a>
                <a href="tel:+41767516652" className="hover:text-pink-300">+41 767516652 · Lugano, CH 🇨🇭</a>
                  </div>
                </form>
              )}
            </div>
          </div>
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
            <a href="#home" onClick={(e) => navigateToSection(e, 'home')} className="hover:text-pink-300 transition-colors">{t('Home', 'Start')}</a>
            <a href="#about" onClick={(e) => navigateToSection(e, 'about')} className="hover:text-pink-300 transition-colors">{t('About', 'Über mich')}</a>
            <a href="#skills" onClick={(e) => navigateToSection(e, 'skills')} className="hover:text-pink-300 transition-colors">{t('Skills', 'Kenntnisse')}</a>
            <a href="#projects" onClick={(e) => navigateToSection(e, 'projects')} className="hover:text-pink-300 transition-colors">{t('Projects', 'Projekte')}</a>
            <a href="#terminal" onClick={(e) => navigateToSection(e, 'terminal')} className="hover:text-pink-300 transition-colors">{t('Terminal', 'Konsole')}</a>
            <button type="button" onClick={() => setIsResumeOpen(true)} className="hover:text-pink-300 transition-colors">{t('Resume', 'Lebenslauf')}</button>
            <a href="#contact" onClick={(e) => navigateToSection(e, 'contact')} className="hover:text-pink-300 transition-colors">{t('Contact', 'Kontakt')}</a>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="https://github.com/adriennie" target="_blank" rel="noreferrer" className="hover:text-pink-300 transition-colors">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/adrika-pradhan-3a92622ba/" target="_blank" rel="noreferrer" className="hover:text-pink-300 transition-colors">LinkedIn ↗</a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
              className="text-pink-400 hover:text-pink-300 transition-colors ml-2"
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
              className="bg-[#0B0F1A] border border-pink-500/30 rounded-3xl max-w-5xl w-full p-6 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-pink-950/60 pb-4">
                <div>
                  <h3 id="resume-modal-title" className="text-xl font-bold text-white">{t('Adrika Pradhan — Resume', 'Adrika Pradhan — Lebenslauf')}</h3>
                  <p className="text-xs text-pink-400 font-mono mt-0.5">{t('M.Sc. Artificial Intelligence, USI Lugano', 'M.Sc. Künstliche Intelligenz, USI Lugano')}</p>
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-950/60">
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
                  className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-pink-500 text-slate-950 font-bold hover:bg-pink-400 transition-colors flex items-center gap-2"
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
