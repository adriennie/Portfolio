import React, { useEffect, useRef, useState } from 'react';
import { logTriageReplay } from '../data/logTriageReplay.js';

const BASE_URL = `${import.meta.env.BASE_URL}/`;

const benchmarkData = {
  1: { transformers: 18.77, vllm: 30.05, generate: 19.72 },
  2: { transformers: 18.19, vllm: 50.13, generate: 42.87 },
  4: { transformers: 36.04, vllm: 116.06, generate: 83.91 },
  8: { transformers: 61.42, vllm: 226.98, generate: 163.31 },
  16: { transformers: 107.00, vllm: 270.61, generate: 325.02 },
  32: { transformers: 173.45, vllm: 877.69, generate: 613.65 },
};

const loraData = {
  4: { params: '544,768', overhead: '0.0353%', time: '55.50s', vram: '6.55 GB', loss: '2.4458' },
  8: { params: '1,089,536', overhead: '0.0705%', time: '47.83s', vram: '4.76 GB', loss: '2.4438' },
  16: { params: '2,179,072', overhead: '0.1410%', time: '48.55s', vram: '4.77 GB', loss: '2.4248' },
};

const virtualFiles = [
  'about.md',
  'skills.json',
  'resume.pdf',
  'benchmark.csv',
  'projects.txt',
  'contact.sh',
];

const availableSections = ['home', 'about', 'skills', 'certificates', 'projects', 'terminal', 'contact'];

const commandList = [
  'help', 'run', 'bench', 'about', 'focus', 'skills', 'benchmark', 'lora', 'triage', 'methods',
  'projects', 'contact', 'ls', 'cat', 'tree', 'whoami', 'pwd', 'resume',
  'goto', 'cd', 'lang', 'neofetch', 'matrix', 'cowsay', 'quote', 'clear', 'reset', 'date'
];

const makeInitialHistory = (language) => [
  {
    type: 'system',
    text: language === 'de'
      ? 'adrika-term v2.4 · USI Lugano (M.Sc. Künstliche Intelligenz)'
      : 'adrika-term v2.4 · USI Lugano (M.Sc. Artificial Intelligence)',
    chips: ['help', 'run triage', 'bench --batch 32', 'lora 8', 'ls', 'resume'],
  },
];

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let streamCounter = 0;

export default function PortfolioTerminal({
  language = 'en',
  onOpenResume,
  onNavigate,
  onLanguageChange,
}) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(() => makeInitialHistory(language));
  const [historyBuffer, setHistoryBuffer] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  const t = (en, de) => (language === 'de' ? de : en);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
    });
  }, [history]);

  useEffect(() => {
    setHistory((current) => (current.length <= 1 ? makeInitialHistory(language) : current));
  }, [language]);

  const handleCopySession = () => {
    const sessionText = history
      .map((item) => {
        if (item.type === 'input' || item.type === 'system') return item.text;
        if (item.type === 'response') {
          const lines = item.lines || [];
          return item.heading ? `[${item.heading}]\n${lines.join('\n')}` : lines.join('\n');
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n');

    navigator.clipboard.writeText(sessionText).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };


  // Appends a response, then reveals its lines one at a time (all at once with reduced motion).
  const streamResponse = (inputText, { heading, lines, chips, links }, delay = 320) => {
    streamCounter += 1;
    const id = `stream-${streamCounter}`;
    const instant = prefersReducedMotion();
    setHistory((current) => [
      ...current,
      { type: 'input', text: `$ ${inputText}` },
      { type: 'response', id, heading, lines: instant ? lines : [], chips: instant ? chips : [], links: instant ? links : [] },
    ].slice(-28));
    if (instant) return;
    lines.forEach((line, index) => {
      window.setTimeout(() => {
        setHistory((current) => current.map((item) => {
          if (item.id !== id) return item;
          const done = index === lines.length - 1;
          return { ...item, lines: [...item.lines, line], chips: done ? chips : item.chips, links: done ? links : item.links };
        }));
      }, delay * (index + 1));
    });
  };

  const streamTriageReplay = (inputText) => {
    const { chunks, citations, command: cliCommand } = logTriageReplay;
    const lines = [`$ ${cliCommand}`];
    chunks.forEach((chunk) => {
      chunk.sample.slice(0, 2).forEach((line) => lines.push(`  ${String(line.n).padStart(4)} │ ${line.text.slice(0, 92)}…`));
      lines.push(`  ▸ chunk ${chunk.index} · ${chunk.cumulative.toLocaleString()} lines · ${chunk.templates} templates · ${chunk.anomalies} anomalies · ${chunk.latencyMs} ms · guardrail ${chunk.guardrail}`);
    });
    lines.push(`✔ ${chunks.at(-1).cumulative.toLocaleString()} lines in ${chunks.length} chunks · ${chunks.reduce((sum, chunk) => sum + chunk.anomalies, 0)} anomalies flagged`);
    citations.forEach((citation) => lines.push(`  ✓ ${citation.block.slice(0, 20)}… cites line ${citation.line} → found in window, verified`));
    lines.push(t('● Citation guardrail PASSED · 0.00% hallucination (24/24 in the full analyze run)', '● Zitations-Guardrail BESTANDEN · 0,00 % Halluzination (24/24 im vollständigen Analyze-Lauf)'));
    streamResponse(inputText, {
      heading: t('Replaying recorded stream run · Loghub HDFS_2k', 'Wiedergabe des aufgezeichneten Stream-Laufs · Loghub HDFS_2k'),
      lines,
      chips: ['triage', 'bench --batch 32', 'goto projects'],
      links: [{ label: t('Open interactive replay ↗', 'Interaktive Wiedergabe öffnen ↗'), href: `${BASE_URL}projects/log-triage#results` }],
    }, 260);
  };

  const streamBench = (inputText, bs) => {
    const data = benchmarkData[bs];
    const bar = (value) => `${'█'.repeat(Math.max(1, Math.round((value / 900) * 28)))}`;
    streamResponse(inputText, {
      heading: t(`Throughput at batch ${bs} · Qwen2.5-1.5B on Tesla T4`, `Durchsatz bei Batch ${bs} · Qwen2.5-1.5B auf Tesla T4`),
      lines: [
        `vLLM            ${bar(data.vllm).padEnd(28)} ${data.vllm.toFixed(2)} tok/s`,
        `HF generate()   ${bar(data.generate).padEnd(28)} ${data.generate.toFixed(2)} tok/s`,
        `HF Transformers ${bar(data.transformers).padEnd(28)} ${data.transformers.toFixed(2)} tok/s`,
        `→ ${(data.vllm / data.transformers).toFixed(2)}x vs Transformers · ${(data.vllm / data.generate).toFixed(2)}x vs generate() (separate runs)`,
      ],
      chips: [1, 2, 4, 8, 16, 32].filter((size) => size !== bs).slice(-3).map((size) => `bench --batch ${size}`),
      links: [{ label: t('Open benchmark replay ↗', 'Benchmark-Wiedergabe öffnen ↗'), href: `${BASE_URL}projects/vllm-pagedattention-benchmark#results` }],
    }, 380);
  };

  // Lets the command palette run a command here.
  const executeRef = useRef(null);
  useEffect(() => {
    const onRun = (event) => executeRef.current?.(event.detail);
    window.addEventListener('portfolio-terminal-run', onRun);
    return () => window.removeEventListener('portfolio-terminal-run', onRun);
  }, []);

  const executeCommand = (rawCommand) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    setHistoryBuffer((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();
    const fullArg = parts.slice(1).join(' ');

    if (command === 'clear' || command === 'cls') {
      setHistory([]);
      return;
    }

    if (command === 'reset') {
      setHistory(makeInitialHistory(language));
      return;
    }

    if (command === 'run' && (!arg || arg === 'triage')) {
      streamTriageReplay(trimmed);
      return;
    }

    if (command === 'bench') {
      const batchMatch = fullArg.match(/(\d+)/);
      const bs = [1, 2, 4, 8, 16, 32].includes(Number(batchMatch?.[1])) ? Number(batchMatch[1]) : 32;
      streamBench(trimmed, bs);
      return;
    }

    let responseItem = null;

    switch (command) {
      case 'help': {
        responseItem = {
          heading: t('Available Commands', 'Verfügbare Befehle'),
          lines: [
            '  run triage       Replay the recorded HDFS stream run, chunk by chunk',
            '  bench --batch N  Animated vLLM vs Hugging Face throughput (N: 1, 2, 4, 8, 16, 32)',
            '  benchmark [bs]   vLLM PagedAttention throughput replay (bs: 1, 2, 4, 8, 16, 32)',
            '  lora [rank]      PEFT adapter routing & parameter breakdown (rank: 4, 8, 16)',
            '  triage           Streaming log parser with Drain3 & citation guardrails',
            '  ls / cat <file>  Virtual workspace files (about.md, skills.json, resume.pdf...)',
            '  resume           Open official curriculum vitae modal',
            '  goto <section>   Navigate page (projects, skills, contact, home)',
            '  lang <en|de>     Switch portfolio language',
            '  neofetch         System specifications & research profile',
            '  clear            Clear console output (Ctrl+L)',
          ],
          chips: ['benchmark 32', 'lora 8', 'triage', 'ls', 'resume', 'neofetch'],
        };
        break;
      }

      case 'benchmark': {
        const bs = [1, 2, 4, 8, 16, 32].includes(Number(arg)) ? Number(arg) : 32;
        const row = benchmarkData[bs];
        const tfRatio = (row.vllm / row.transformers).toFixed(2);
        const genRatio = (row.vllm / row.generate).toFixed(2);

        responseItem = {
          heading: `vLLM PagedAttention Benchmark (BS=${bs})`,
          type: 'bars',
          barData: [
            { label: 'vLLM (PagedAttention)', value: row.vllm, ratio: `${tfRatio}×`, color: 'from-accent-500 to-neon-400' },
            { label: 'HF Transformers', value: row.transformers, ratio: '1.00×', color: 'from-slate-500 to-slate-600' },
            { label: 'HF generate()', value: row.generate, ratio: `${genRatio}×`, color: 'from-violet-400 to-indigo-500' },
          ],
          lines: [
            `Workload: Qwen2.5-1.5B-Instruct · FP16 · Tesla T4`,
            `Speedup: ${tfRatio}× vs Transformers · ${genRatio}× vs separate generate() row`,
          ],
          chips: ['benchmark 1', 'benchmark 4', 'benchmark 8', 'benchmark 16', 'benchmark 32'],
          links: [{ label: t('View benchmark suite ↗', 'Benchmark-Suite ansehen ↗'), href: `${BASE_URL}projects/vllm-pagedattention-benchmark` }],
        };
        break;
      }

      case 'lora': {
        const rank = [4, 8, 16].includes(Number(arg)) ? Number(arg) : 8;
        const data = loraData[rank];

        responseItem = {
          heading: `LoRA Rank Ablation (r=${rank})`,
          lines: [
            `Trainable parameters: ${data.params} (${data.overhead} of frozen base)`,
            `Recorded run: ${data.time} on T4 · Peak VRAM ${data.vram} · Final loss ${data.loss}`,
            `Routing: Base Model ──> [LoraRequest rank=${rank}] ──> Shared vLLM Engine`,
          ],
          chips: ['lora 4', 'lora 8', 'lora 16'],
          links: [{ label: t('View LoRA extension ↗', 'LoRA-Erweiterung ansehen ↗'), href: `${BASE_URL}projects/vllm-lora-extension` }],
        };
        break;
      }

      case 'triage': {
        responseItem = {
          heading: 'Log Triage Assistant',
          lines: [
            'Stream:  Loghub HDFS_2k dataset (2,000 lines streamed in 4 bounded chunks)',
            'Parser:  Drain3 discovered 17 semantic templates (71.43% template accuracy)',
            'Safety:  Citation verification guardrail: 24/24 verified (0.00% hallucination rate)',
            'Metrics: 5,781.4 lines/s · 345.9 ms pipeline latency · 4.04 MB peak RAM',
          ],
          chips: ['benchmark 32', 'lora 8'],
          links: [{ label: t('View triage project ↗', 'Triage-Projekt ansehen ↗'), href: `${BASE_URL}projects/log-triage` }],
        };
        break;
      }

      case 'ls':
      case 'dir': {
        responseItem = {
          heading: 'Workspace: ~/usi-research',
          type: 'files',
          files: virtualFiles,
          lines: [
            'projects/   benchmarks/   about.md   skills.json   resume.pdf   benchmark.csv   projects.txt   contact.sh',
          ],
          chips: virtualFiles.map((f) => `cat ${f}`),
        };
        break;
      }

      case 'cat': {
        const filename = arg?.toLowerCase();
        if (!filename) {
          responseItem = {
            heading: 'cat: missing filename',
            lines: ['Usage: cat <filename> (e.g. cat about.md, cat resume.pdf)'],
            chips: virtualFiles.map((f) => `cat ${f}`),
          };
          break;
        }

        if (filename === 'resume.pdf' || filename === 'resume' || filename === 'cv') {
          if (onOpenResume) onOpenResume();
          responseItem = {
            heading: 'resume.pdf',
            lines: [
              t('Opened official PDF curriculum vitae modal.', 'Offiziellen Lebenslauf als PDF geöffnet.'),
              'Adrika Pradhan · M.Sc. Artificial Intelligence, USI Lugano',
            ],
            links: [{ label: t('Download PDF ↗', 'PDF herunterladen ↗'), href: `${BASE_URL}resume.pdf` }],
          };
        } else if (filename === 'about.md') {
          responseItem = {
            heading: 'about.md',
            lines: [
              'Adrika Pradhan · M.Sc. Artificial Intelligence @ USI Lugano.',
              'Focus: LLM inference optimization, KV-cache behavior, and PEFT multi-adapter serving.',
              'Approach: Rigorous empirical baselines and resource-aware systems.',
            ],
            chips: ['cat skills.json', 'cat resume.pdf'],
          };
        } else if (filename === 'skills.json') {
          responseItem = {
            heading: 'skills.json',
            lines: [
              'Languages: Python, SQL, TypeScript, Java, C++',
              'ML / LLM:  PyTorch, vLLM, Hugging Face, PEFT, TensorFlow, scikit-learn',
              'Systems:   FastAPI, OpenTelemetry, Drain3, PostgreSQL, Supabase, Docker',
            ],
            chips: ['goto skills', 'benchmark 32'],
          };
        } else if (filename === 'benchmark.csv') {
          responseItem = {
            heading: 'benchmark.csv',
            lines: [
              'batch, vLLM (tok/s), HF Transformers, HF generate(), speedup',
              '1,     30.05,        18.77,           19.72,         1.60x',
              '2,     50.13,        18.19,           42.87,         2.76x',
              '4,     116.06,       36.04,           83.91,         3.22x',
              '8,     226.98,       61.42,           163.31,        3.70x',
              '16,    270.61,       107.00,          325.02,        2.53x',
              '32,    877.69,       173.45,          613.65,        5.06x',
            ],
            chips: ['benchmark 32', 'benchmark 16'],
          };
        } else if (filename === 'projects.txt') {
          responseItem = {
            heading: 'projects.txt',
            lines: [
              '1. SIB Doc (hackathon)           -> Privacy-checked NL-to-SPARQL for clinical graphs',
              '2. Log Triage Assistant          -> Streaming anomaly detection & citation guardrails',
              '3. vLLM PagedAttention Benchmark -> 5.06x speedup on NVIDIA Tesla T4',
              '4. LoRA Extension & Routing      -> Multi-adapter serving with PEFT on vLLM',
              '5. Astronomical Denoising        -> Learning project: post-mortem of a collapsed denoiser',
              '6. Swasthya (Major Project 2)    -> Group: pharmacy demand forecasting & reorders',
              '7. EcoShare (Major Project 1)    -> Group: AI-assisted neighbourhood sharing',
            ],
            chips: ['goto projects', 'triage', 'benchmark 32'],
          };
        } else if (filename === 'contact.sh') {
          responseItem = {
            heading: 'contact.sh',
            lines: [
              'EMAIL="adrika.pradhan@usi.ch"',
              'GITHUB="https://github.com/adriennie"',
              'LOCATION="Lugano, Switzerland"',
            ],
            chips: ['goto contact'],
            links: [{ label: 'Email Adrika ↗', href: 'mailto:adrika.pradhan@usi.ch' }],
          };
        } else {
          responseItem = {
            heading: `cat: ${filename}: No such file`,
            lines: ['Type "ls" to view available files.'],
            chips: ['ls'],
          };
        }
        break;
      }

      case 'tree': {
        responseItem = {
          heading: 'adrika-portfolio',
          lines: [
            '.',
            '├── hackathons/         (sib-doc-neural-wave)',
            '├── research/           (log-triage, vllm-benchmark, lora-routing, astro-denoising)',
            '├── applied-products/   (swasthya-pharmacy, ecoshare-marketplace)',
            '└── credentials/        (USI_MSc_AI, resume.pdf)',
          ],
          chips: ['ls', 'goto projects'],
        };
        break;
      }

      case 'whoami':
      case 'id': {
        responseItem = {
          lines: [
            'adrika · M.Sc. Artificial Intelligence @ USI Lugano',
            'Target GPU: NVIDIA Tesla T4 · Groups: ai-research, llm-systems',
          ],
          chips: ['about', 'skills'],
        };
        break;
      }

      case 'pwd': {
        responseItem = {
          lines: ['/home/adrika/usi-research'],
        };
        break;
      }

      case 'resume':
      case 'cv': {
        if (onOpenResume) onOpenResume();
        responseItem = {
          heading: t('Launching Résumé Viewer', 'Lebenslauf-Viewer wird geöffnet'),
          lines: [t('Opened official PDF curriculum vitae modal.', 'Offizieller Lebenslauf als PDF geöffnet.')],
          links: [{ label: t('Download PDF ↗', 'PDF herunterladen ↗'), href: `${BASE_URL}resume.pdf` }],
        };
        break;
      }

      case 'goto':
      case 'cd': {
        const target = (arg || '').replace(/^#/, '');
        if (!target || target === '~' || target === '/' || target === '..' || target === '../') {
          if (onNavigate) onNavigate('home');
          responseItem = { lines: [t('Navigated to Home.', 'Zum Seitenanfang navigiert.')] };
        } else if (availableSections.includes(target)) {
          if (onNavigate) onNavigate(target);
          responseItem = { lines: [t(`Scrolled to #${target}`, `Zu #${target} navigiert`)] };
        } else {
          responseItem = {
            heading: `cd: unknown section: ${target}`,
            lines: [`Available: ${availableSections.join(', ')}`],
            chips: availableSections.map((s) => `goto ${s}`),
          };
        }
        break;
      }

      case 'lang': {
        const requestedLang = arg?.toLowerCase();
        if (requestedLang === 'de' || requestedLang === 'en') {
          if (onLanguageChange) onLanguageChange(requestedLang);
          responseItem = {
            lines: [requestedLang === 'de' ? 'Sprache: Deutsch (DE)' : 'Language: English (EN)'],
          };
        } else {
          responseItem = {
            lines: [`Current: ${language.toUpperCase()}. Usage: lang en | lang de`],
            chips: ['lang en', 'lang de'],
          };
        }
        break;
      }

      case 'neofetch':
      case 'fetch': {
        responseItem = {
          type: 'ascii',
          lines: [
            '  🌸___🌸    adrika@usi-research',
            ' ( • . • )   -------------------',
            ' /  ||  \\    OS: macOS Darwin · USI AI Lab',
            '             Host: Università della Svizzera italiana (USI)',
            '             Degree: M.Sc. Artificial Intelligence',
            '             Kernel: PyTorch · vLLM · PEFT',
            '             Hardware: NVIDIA Tesla T4 (FP16)',
            '             Focus: KV-cache · LoRA Routing · Observability',
          ],
          chips: ['benchmark 32', 'skills'],
        };
        break;
      }

      case 'matrix': {
        responseItem = {
          type: 'ascii',
          lines: [
            'vLLM::PagedAttention [877.69 tok/s] ·· Drain3 [5.78k lines/s]',
            'LoRA::Rank[4,8,16] ──> LoraRequest ──> Shared vLLM Engine',
            'SIB Doc::Guard [0/117 forbidden let through] · Hallucination Rate: 0.00%',
          ],
          chips: ['help', 'neofetch'],
        };
        break;
      }

      case 'cowsay': {
        const text = fullArg || 'No one is better; some simply work smarter and harder.';
        const border = '-'.repeat(text.length + 2);
        responseItem = {
          type: 'ascii',
          lines: [
            `  ${border}`,
            `< ${text} >`,
            `  ${border}`,
            '        \\   ^__^',
            '         \\  (oo)\\_______',
            '            (__)\\       )\\/\\',
            '                ||----w |',
            '                ||     ||',
          ],
        };
        break;
      }

      case 'quote':
      case 'motto': {
        responseItem = {
          lines: ['“No one is better; some simply work smarter and harder.” — Personal Motto'],
        };
        break;
      }

      case 'about': {
        responseItem = {
          heading: 'Adrika Pradhan',
          lines: [
            t(
              'M.Sc. Artificial Intelligence student at USI Lugano, working on LLM systems, inference optimization, and scientific data.',
              'Masterstudentin der Künstlichen Intelligenz an der USI Lugano mit Fokus auf LLM-Systeme, Inferenzoptimierung und wissenschaftliche Daten.'
            ),
          ],
          chips: ['skills', 'focus', 'projects'],
        };
        break;
      }

      case 'focus': {
        responseItem = {
          heading: t('Technical Focus', 'Schwerpunkte'),
          lines: [
            '1. LLM inference performance, PagedAttention, and KV-cache dynamics.',
            '2. Parameter-efficient fine-tuning (PEFT/LoRA) and multi-adapter serving.',
            '3. Trustworthy AI guardrails for operational and scientific data.',
          ],
          chips: ['benchmark 32', 'lora 8', 'triage'],
        };
        break;
      }

      case 'skills': {
        responseItem = {
          heading: t('Skills', 'Kenntnisse'),
          lines: [
            'Python, PyTorch, vLLM, Hugging Face, PEFT, SQL, TypeScript, FastAPI, OpenTelemetry, PostgreSQL',
          ],
          chips: ['goto skills', 'benchmark 32'],
        };
        break;
      }

      case 'methods': {
        responseItem = {
          heading: t('Evaluation Principles', 'Evaluationsgrundsätze'),
          lines: [
            '1. Record model, hardware, runtime, and measurement methodology explicitly.',
            '2. Compare against clear baselines without collapsing results into a single number.',
            '3. Report limitations and non-evidence alongside speedup claims.',
          ],
          chips: ['benchmark 32', 'triage'],
        };
        break;
      }

      case 'projects': {
        responseItem = {
          heading: t('Selected Projects', 'Ausgewählte Projekte'),
          lines: [
            '• SIB Doc — Neural Wave hackathon (LLM agents, SPARQL, privacy guard)',
            '• Log Triage Assistant (FastAPI, Drain3, OpenTelemetry)',
            '• vLLM PagedAttention Benchmark (5.06x speedup on T4)',
            '• vLLM LoRA Extension (PEFT routing on shared engine)',
            '• Astronomical Denoising (learning project · post-mortem)',
            '• Swasthya (Major Project 2 · group): Expo, Supabase, FastAPI ML',
            '• EcoShare (Major Project 1 · group): Expo, Express, Supabase, Hugging Face',
          ],
          chips: ['goto projects', 'triage', 'benchmark 32'],
        };
        break;
      }

      case 'contact':
      case 'email': {
        responseItem = {
          heading: 'Contact',
          lines: [
            'Adrika Pradhan · Lugano, Switzerland',
            'Email: adrika.pradhan@usi.ch · GitHub: github.com/adriennie',
          ],
          chips: ['goto contact'],
          links: [
            { label: 'Email Adrika ↗', href: 'mailto:adrika.pradhan@usi.ch' },
            { label: 'GitHub: adriennie ↗', href: 'https://github.com/adriennie' },
          ],
        };
        break;
      }

      case 'date': {
        responseItem = {
          lines: [new Date().toLocaleString(language === 'de' ? 'de-CH' : 'en-US', { timeZoneName: 'short' })],
        };
        break;
      }

      default: {
        responseItem = {
          lines: [
            t(
              `Command not found: “${command}”. Type "help" or "ls".`,
              `Befehl nicht gefunden: „${command}“. Tippe „help“ oder „ls“.`
            ),
          ],
          chips: ['help', 'ls', 'benchmark 32'],
        };
        break;
      }
    }

    setHistory((current) => [
      ...current,
      { type: 'input', text: `$ ${trimmed}` },
      { type: 'response', ...responseItem },
    ].slice(-28));
  };

  executeRef.current = executeCommand;

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyBuffer.length === 0) return;
      const nextIndex = historyIndex === -1 ? historyBuffer.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(historyBuffer[nextIndex] || '');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= historyBuffer.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(historyBuffer[nextIndex] || '');
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const trimmed = input.trim().toLowerCase();
      if (!trimmed) {
        executeCommand('help');
        return;
      }
      const parts = trimmed.split(/\s+/);
      if (parts.length === 1) {
        const matches = commandList.filter((c) => c.startsWith(parts[0]));
        if (matches.length === 1) {
          setInput(matches[0]);
        }
      } else if (parts.length === 2 && parts[0] === 'cat') {
        const matches = virtualFiles.filter((name) => name.startsWith(parts[1]));
        if (matches.length === 1) {
          setInput(`cat ${matches[0]}`);
        }
      } else if (parts.length === 2 && (parts[0] === 'goto' || parts[0] === 'cd')) {
        const matches = availableSections.filter((sec) => sec.startsWith(parts[1]));
        if (matches.length === 1) {
          setInput(`${parts[0]} ${matches[0]}`);
        }
      }
    } else if (event.key.toLowerCase() === 'l' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div
      className={`min-w-0 overflow-hidden rounded-2xl border border-accent-500/20 bg-[#07090F]/95 font-mono shadow-2xl backdrop-blur-xl transition-[height] duration-300 ${
        isMaximized ? 'ring-1 ring-accent-500/40' : ''
      }`}
    >
      {/* MINIMAL TERMINAL WINDOW HEADER */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* Subtle macOS Traffic Lights */}
          <button
            type="button"
            onClick={() => setHistory([])}
            title={t('Clear output', 'Ausgabe löschen')}
            aria-label="Clear console"
            className="h-2.5 w-2.5 rounded-full bg-neon-500/80 hover:bg-neon-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setHistory(makeInitialHistory(language))}
            title={t('Reset console', 'Konsole zurücksetzen')}
            aria-label="Reset console"
            className="h-2.5 w-2.5 rounded-full bg-amber-400/80 hover:bg-amber-400 transition-colors"
          />
          <button
            type="button"
            onClick={() => setIsMaximized((prev) => !prev)}
            title={isMaximized ? t('Compact', 'Verkleinern') : t('Expand', 'Vergrößern')}
            aria-label="Toggle height"
            className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 hover:bg-emerald-400 transition-colors"
          />
          <span className="ml-2 text-[11px] text-slate-400 select-none">
            adrika@usi: ~
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySession}
            title={t('Copy transcript', 'Transkript kopieren')}
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors px-1.5 py-0.5 rounded hover:bg-white/[0.05]"
          >
            {copied ? '✓ ' + t('Copied', 'Kopiert') : '⧉ ' + t('Copy', 'Kopieren')}
          </button>
          <button
            type="button"
            onClick={() => setIsMaximized((prev) => !prev)}
            title={isMaximized ? t('Restore compact', 'Kompakt') : t('Maximize', 'Vergrößern')}
            className="hidden sm:inline text-[11px] text-slate-500 hover:text-slate-300 transition-colors px-1.5 py-0.5 rounded hover:bg-white/[0.05]"
          >
            {isMaximized ? '🗗' : '🗖'}
          </button>
        </div>
      </div>

      {/* STREAMLINED OUTPUT STREAM (No nested cards) */}
      <div
        aria-live="polite"
        aria-label={t('Terminal output', 'Konsolenausgabe')}
        onClick={() => inputRef.current?.focus()}
        className={`min-w-0 space-y-3.5 overflow-y-auto px-4 py-3.5 text-xs transition-[height] duration-300 sm:px-5 ${
          isMaximized ? 'h-[440px]' : 'h-64'
        }`}
      >
        {history.map((item, index) => {
          if (item.type === 'input') {
            return (
              <div key={index} className="flex items-center gap-2 font-semibold text-accent-300 pt-1">
                <span className="text-accent-400 select-none">$</span>
                <span>{item.text.replace(/^\$\s*/, '')}</span>
              </div>
            );
          }

          if (item.type === 'system') {
            return (
              <div key={index} className="space-y-1.5 text-slate-400 text-[11px]">
                <p>{item.text}</p>
                {item.chips && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {item.chips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => executeCommand(chip)}
                        className="rounded border border-accent-500/25 bg-accent-500/5 px-2 py-0.5 text-[10px] text-accent-300 hover:border-accent-400 hover:bg-accent-500/15 hover:text-white transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={index} className="space-y-1.5 pl-3 border-l border-accent-500/30 text-slate-300">
              {item.heading && (
                <p className="font-semibold text-slate-100 text-[11px] pb-0.5">{item.heading}</p>
              )}

              {/* Minimal inline horizontal bar comparison for benchmarks */}
              {item.type === 'bars' && item.barData && (
                <div className="space-y-2 py-1 max-w-lg">
                  {item.barData.map((bar) => {
                    const pct = Math.min(100, Math.round((bar.value / 900) * 100));
                    return (
                      <div key={bar.label} className="space-y-0.5 text-[11px]">
                        <div className="flex justify-between text-slate-300 font-mono">
                          <span>{bar.label}</span>
                          <span className="text-white font-semibold">
                            {bar.value.toFixed(2)} tok/s <span className="text-accent-400 text-[10px]">({bar.ratio})</span>
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-900 border border-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Monospace ASCII or Standard Lines */}
              {item.type === 'ascii' ? (
                <pre className="text-[11px] leading-relaxed text-accent-300/90 font-mono py-1">
                  {item.lines.join('\n')}
                </pre>
              ) : (
                <div className="space-y-1 text-slate-300 text-[11px] font-mono">
                  {item.lines?.map((line, lIdx) => (
                    <p key={lIdx} className="leading-relaxed whitespace-pre-wrap">{line}</p>
                  ))}
                </div>
              )}

              {/* Minimal Inline Chips */}
              {item.chips?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  {item.chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => executeCommand(chip)}
                      className="rounded border border-accent-500/20 bg-accent-500/5 px-2 py-0.5 text-[10px] text-accent-300/90 hover:border-accent-400 hover:bg-accent-500/15 hover:text-white transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Minimal Text Link */}
              {item.links?.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {item.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="text-[11px] text-accent-300 underline underline-offset-2 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* MINIMAL INPUT LINE */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          executeCommand(input);
          setInput('');
        }}
        className="flex items-center gap-2 border-t border-white/[0.06] bg-white/[0.015] px-4 py-2.5 sm:px-5"
      >
        <span aria-hidden="true" className="font-bold text-accent-400 select-none">
          $
        </span>

        <input
          ref={inputRef}
          type="text"
          aria-label={t('Enter a command', 'Befehl eingeben')}
          autoComplete="off"
          spellCheck="false"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            language === 'de'
              ? 'help, benchmark 32, lora 8, ls, resume...'
              : 'help, benchmark 32, lora 8, ls, resume...'
          }
          className="flex-1 bg-transparent py-0.5 text-xs text-white outline-none placeholder:text-slate-600 font-mono"
        />

        {/* Small subtle return key indicator on mobile */}
        <button
          type="submit"
          aria-label="Execute command"
          className="sm:hidden text-xs text-accent-400 hover:text-white px-1.5 py-0.5"
        >
          ↵
        </button>
      </form>
    </div>
  );
}
