import React, { useEffect, useRef, useState } from 'react';

const commandData = {
  help: {
    heading: 'Available commands',
    lines: ['about · profile and study context', 'focus · current technical interests', 'skills · tools and languages', 'triage · log analysis results and limits', 'benchmark · vLLM benchmark result and setup', 'lora · adapter experiment and limitations', 'methods · how I approach experiments', 'projects · selected work', 'contact · location and GitHub'],
  },
  about: {
    heading: 'Profile',
    lines: ['Adrika Pradhan · M.Sc. Artificial Intelligence student at USI Lugano.', 'Interested in practical AI systems, empirical evaluation, and resource-aware engineering.'],
  },
  focus: {
    heading: 'Current interests',
    lines: ['LLM inference performance and KV-cache behavior', 'Parameter-efficient fine-tuning and multi-adapter serving', 'Applied machine learning for scientific and operational data'],
  },
  skills: {
    heading: 'Technical toolkit',
    lines: ['Languages: Python, SQL, TypeScript, Java', 'ML: PyTorch, TensorFlow, scikit-learn, Hugging Face', 'LLM systems: vLLM, PEFT / LoRA', 'Data & cloud: PostgreSQL, Supabase, Google Cloud'],
  },
  benchmark: {
    heading: 'vLLM · benchmark snapshot',
    lines: ['Model: Qwen2.5-1.5B-Instruct · FP16 · NVIDIA Tesla T4', 'Batch 32: 877.69 tok/s vLLM vs 173.45 tok/s HF Transformers (5.06×).', 'A separate HF generate() row recorded 613.65 tok/s (1.43× comparison). These are notebook measurements, not a controlled serving benchmark.'],
    links: [{ label: 'Benchmark details & results', href: '/projects/vllm-pagedattention-benchmark' }],
  },
  triage: {
    heading: 'Log Triage · results snapshot',
    lines: ['5,781.4 lines/s throughput · 345.93 ms pipeline latency · 4.04 MB peak memory.', '0.00% citation hallucination rate with 24/24 citations verified; template accuracy reached 71.43%.', 'Classification remains exploratory: F1 0.0061 and recall 0.0033 on the checked-in HDFS benchmark.'],
    links: [{ label: 'Triage details & results', href: '/projects/log-triage' }],
  },
  lora: {
    heading: 'LoRA · experiment snapshot',
    lines: ['Trained Qwen2.5-1.5B-Instruct adapters at ranks 4, 8, and 16; routed requests through one vLLM engine.', 'Exploratory setup: four unique examples repeated 25 times; one run per rank; no held-out evaluation.', 'Training loss is not evidence of generalization or a best rank.'],
    links: [{ label: 'LoRA methods & artifacts', href: '/projects/vllm-lora-extension' }],
  },
  methods: {
    heading: 'Evaluation principles',
    lines: ['Record model, hardware, runtime, workload, and measurement method.', 'Compare against explicit baselines; keep distinct runs and metrics separate.', 'Report limitations alongside results. Prefer reproducible artifacts over unsupported claims.'],
  },
  projects: {
    heading: 'Selected projects',
    lines: ['Observability · streaming log triage with citation guardrails and trace correlation', 'LLM systems · vLLM throughput benchmark and LoRA adapter routing', 'Applied AI · Swasthya pharmacy network and EcoShare community marketplace', 'Research · astronomical image denoising and object detection'],
    links: [
      { label: 'Log triage assistant', href: '/projects/log-triage' },
      { label: 'vLLM benchmark', href: '/projects/vllm-pagedattention-benchmark' },
      { label: 'LoRA extension', href: '/projects/vllm-lora-extension' },
      { label: 'Swasthya', href: '/projects/swasthya' },
      { label: 'EcoShare', href: '/projects/ecoshare' },
      { label: 'Astronomical imaging', href: '/projects/astronomical-image-processing' },
    ],
  },
  contact: {
    heading: 'Contact',
    lines: ['Based in Lugano, Switzerland · M.Sc. AI @ USI', 'GitHub: github.com/adriennie'],
    links: [{ label: 'Email Adrika', href: 'mailto:adrika.pradhan@usi.ch' }, { label: 'GitHub profile', href: 'https://github.com/adriennie' }],
  },
};

const germanCommandData = {
  help: { heading: 'Verfügbare Befehle', lines: ['about · Profil und Studium', 'focus · aktuelle technische Interessen', 'skills · Technologien und Sprachen', 'triage · Ergebnisse und Grenzen der Loganalyse', 'benchmark · vLLM-Ergebnis und Versuchsaufbau', 'lora · Adapter-Experiment und Einschränkungen', 'methods · mein Vorgehen bei Experimenten', 'projects · ausgewählte Projekte', 'contact · Standort und GitHub'] },
  about: { heading: 'Profil', lines: ['Adrika Pradhan · Masterstudentin der Künstlichen Intelligenz an der USI Lugano.', 'Interessiert an praktischen KI-Systemen, empirischer Evaluation und ressourcenschonender Entwicklung.'] },
  focus: { heading: 'Aktuelle Interessen', lines: ['LLM-Inferenzleistung und Verhalten des KV-Caches', 'Parameter-effizientes Fine-Tuning und Bereitstellung mehrerer Adapter', 'Angewandtes maschinelles Lernen für wissenschaftliche und operative Daten'] },
  skills: { heading: 'Technologien', lines: ['Sprachen: Python, SQL, TypeScript, Java', 'ML: PyTorch, TensorFlow, scikit-learn, Hugging Face', 'LLM-Systeme: vLLM, PEFT / LoRA', 'Daten & Cloud: PostgreSQL, Supabase, Google Cloud'] },
  benchmark: { heading: 'vLLM · Benchmark-Ergebnis', lines: ['Modell: Qwen2.5-1.5B-Instruct · FP16 · NVIDIA Tesla T4', 'Batch 32: 877,69 Tok/s mit vLLM gegenüber 173,45 Tok/s mit HF Transformers (5,06×).', 'Ein separater HF-generate()-Lauf erreichte 613,65 Tok/s (Vergleich: 1,43×). Notebook-Messungen, kein kontrollierter Serving-Benchmark.'], links: [{ label: 'Benchmark-Details und Ergebnisse', href: '/projects/vllm-pagedattention-benchmark' }] },
  lora: { heading: 'LoRA · Experiment', lines: ['Qwen2.5-1.5B-Instruct-Adapter mit Rang 4, 8 und 16 trainiert; Anfragen über eine vLLM-Engine geroutet.', 'Explorativer Aufbau: vier Beispiele, 25-mal wiederholt; ein Lauf je Rang; keine Hold-out-Evaluation.', 'Der Trainingsverlust belegt weder Generalisierung noch einen optimalen Rang.'], links: [{ label: 'LoRA-Methoden und Artefakte', href: '/projects/vllm-lora-extension' }] },
  methods: { heading: 'Grundsätze der Evaluation', lines: ['Modell, Hardware, Laufzeit, Arbeitslast und Messmethode dokumentieren.', 'Mit klar benannten Baselines vergleichen und getrennte Läufe und Metriken auseinanderhalten.', 'Einschränkungen zusammen mit den Ergebnissen berichten. Reproduzierbare Artefakte statt unbelegter Aussagen bevorzugen.'] },
  triage: { heading: 'Log Triage · Ergebnisse', lines: ['5.781,4 Zeilen/s Durchsatz · 345,93 ms Pipeline-Latenz · 4,04 MB Spitzenspeicher.', '0,00 % Zitations-Halluzinationsrate mit 24/24 verifizierten Zitationen; Template-Genauigkeit 71,43 %.', 'Die Klassifikation bleibt explorativ: F1 0,0061 und Recall 0,0033 im HDFS-Benchmark.'], links: [{ label: 'Triage-Details und Ergebnisse', href: '/projects/log-triage' }] },
  projects: { heading: 'Ausgewählte Projekte', lines: ['Observability · Streaming-Log-Triage mit Zitations-Guardrails und Trace-Korrelation', 'LLM-Systeme · vLLM-Durchsatzbenchmark und LoRA-Adapter-Routing', 'Angewandte KI · Swasthya-Apothekennetzwerk und EcoShare-Marktplatz', 'Forschung · Entrauschung astronomischer Bilder und Objekterkennung'], links: [{ label: 'Log Triage Assistant', href: '/projects/log-triage' }, { label: 'vLLM-Benchmark', href: '/projects/vllm-pagedattention-benchmark' }, { label: 'LoRA-Erweiterung', href: '/projects/vllm-lora-extension' }, { label: 'Swasthya', href: '/projects/swasthya' }, { label: 'EcoShare', href: '/projects/ecoshare' }, { label: 'Astronomische Bildverarbeitung', href: '/projects/astronomical-image-processing' }] },
  contact: { heading: 'Kontakt', lines: ['Standort: Lugano, Schweiz · M.Sc. KI an der USI', 'GitHub: github.com/adriennie'], links: [{ label: 'E-Mail an Adrika', href: 'mailto:adrika.pradhan@usi.ch' }, { label: 'GitHub-Profil', href: 'https://github.com/adriennie' }] },
};

const makeInitialHistory = (language) => [
  { type: 'system', text: language === 'de' ? 'ADRIKA / FORSCHUNGSKONSOLE' : 'ADRIKA / RESEARCH CONSOLE' },
  { type: 'system', text: language === 'de' ? 'M.Sc. Künstliche Intelligenz · USI Lugano · help eingeben zum Entdecken.' : 'M.Sc. Artificial Intelligence · USI Lugano · Type help to explore.' },
];

export default function PortfolioTerminal({ language = 'en' }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(() => makeInitialHistory(language));
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  }, [history]);

  useEffect(() => {
    setHistory((current) => current.length <= 2 ? makeInitialHistory(language) : current);
  }, [language]);

  const handleCommand = (rawCommand) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;
    if (command === 'clear') {
      setHistory(makeInitialHistory(language));
      return;
    }

    const response = (language === 'de' ? germanCommandData : commandData)[command] ?? {
      heading: language === 'de' ? 'Befehl nicht gefunden' : 'Command not found',
      lines: [language === 'de' ? `Der Befehl „${command}“ ist unbekannt. Gib help ein, um die verfügbaren Befehle zu sehen.` : `No command named “${command}”. Type help to see what this console can do.`],
    };

    setHistory((current) => [
      ...current,
      { type: 'input', text: `$ ${rawCommand.trim()}` },
      { type: 'response', ...response },
    ].slice(-24));
  };

  const quickCommands = ['help', 'focus', 'triage', 'benchmark', 'lora', 'methods', 'projects'];

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-pink-500/20 bg-[#090C15]/95 font-mono shadow-2xl shadow-pink-950/20 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          <span className="ml-1 truncate text-[11px] text-slate-300">adrika@usi-research:~</span>
        </div>
        <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[9px] uppercase tracking-widest text-emerald-300">{language === 'de' ? 'Forschungskonsole' : 'Research console'}</span>
      </div>

      <div aria-live="polite" aria-label={language === 'de' ? 'Konsolenausgabe' : 'Terminal output'} className="h-64 min-w-0 space-y-3 overflow-y-auto px-4 py-4 text-xs sm:px-5">
        {history.map((item, index) => {
          if (item.type === 'input') return <p key={index} className="break-words font-semibold text-pink-300">{item.text}</p>;
          if (item.type === 'system') return <p key={index} className="break-words text-slate-500">{item.text}</p>;
          return (
            <div key={index} className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 sm:p-4">
              <p className="font-semibold text-slate-100">{item.heading}</p>
              <ul className="space-y-1.5 text-slate-400">
                {item.lines.map((line) => <li key={line} className="break-words leading-relaxed"><span className="mr-2 text-pink-400">›</span>{line}</li>)}
              </ul>
              {item.links?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.links.map((link) => (
                    <a key={link.href} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="inline-flex min-h-8 items-center rounded-lg border border-pink-400/20 bg-pink-400/[0.06] px-2.5 py-1.5 text-[10px] text-pink-200 transition-colors hover:border-pink-400/50 hover:bg-pink-400/10">
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2 border-t border-white/[0.06] px-4 py-3 sm:px-5" aria-label={language === 'de' ? 'Vorgeschlagene Befehle' : 'Suggested commands'}>
        {quickCommands.map((command) => (
          <button key={command} type="button" onClick={() => handleCommand(command)} className="min-h-8 rounded-lg border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] text-slate-400 transition-colors hover:border-pink-400/30 hover:text-pink-200">
            {command}
          </button>
        ))}
        <button type="button" onClick={() => handleCommand('clear')} className="ml-auto min-h-8 rounded-lg px-2.5 py-1 text-[10px] text-slate-500 transition-colors hover:text-slate-200">clear</button>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); handleCommand(input); setInput(''); }} className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-3 sm:px-5">
        <span aria-hidden="true" className="font-bold text-pink-300">$</span>
        <input
          ref={inputRef}
          type="text"
          aria-label={language === 'de' ? 'Befehl für die Portfolio-Konsole eingeben' : 'Enter a portfolio console command'}
          autoComplete="off"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={language === 'de' ? 'z. B. benchmark oder methods' : 'try benchmark or methods'}
          className="min-w-0 flex-1 bg-transparent py-1 text-xs text-white outline-none placeholder:text-slate-600"
        />
        <button type="submit" className="rounded-lg border border-pink-400/20 px-3 py-1.5 text-[10px] text-pink-200 transition-colors hover:bg-pink-400/10">{language === 'de' ? 'Starten' : 'Run'}</button>
      </form>
    </div>
  );
}
