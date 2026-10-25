export const projects = [
  {
    id: "sib-doc",
    card: {
      categories: ["llm"],
      visual: "verdicts",
      shelf: "featured",
      wide: true,
      kicker: { en: "HACKATHON · SIB/SPHN NEURAL WAVE (2026)", de: "HACKATHON · SIB/SPHN NEURAL WAVE (2026)" },
      badge: "🏥 Team Epsilon Dev",
      summary: {
        en: "Research questions in, privacy-checked SPARQL out. Two open-source LLM agents translate questions over Swiss clinical knowledge graphs; a deterministic judge and privacy guard decide what may be released.",
        de: "Forschungsfragen rein, datenschutzgeprüftes SPARQL raus. Zwei Open-Source-LLM-Agenten übersetzen Fragen zu Schweizer klinischen Wissensgraphen; ein deterministischer Prüfer und ein Datenschutz-Guard entscheiden, was freigegeben wird."
      },
      chips: ["Qwen3.6-27B · vLLM", "SPARQL · rdflib", "Docker · CI/CD"],
      tiles: [
        { value: "100%", en: "holdout privacy verdicts", de: "Holdout-Datenschutzurteile" },
        { value: "0/117", en: "forbidden requests let through", de: "verbotene Anfragen durchgelassen" },
        { value: "7.2 s", en: "median latency", de: "Median-Latenz" }
      ],
      cta: { en: "Results & Architecture ↗", de: "Ergebnisse & Architektur ↗" }
    },
    video: { youtubeId: "6jT3EJk6Cb4", title: "SIB Doc demo" },
    title: "SIB Doc",
    subtitle: "SIB/SPHN Neural Wave Hackathon · Team Epsilon Dev (2026)",
    tagline: "Turns natural-language research questions into SPARQL over Swiss clinical knowledge graphs, then checks every query against five patient-privacy rules before release.",
    githubUrl: "https://github.com/neural-wave/ch-EpsilonDev",
    tags: ["Python", "Qwen3.6-27B (AWQ)", "vLLM", "SPARQL", "rdflib", "Docker"],
    artifacts: {
      type: "Hackathon Deliverables",
      items: [
        "Judged /nl-to-sparql API with compliance verdicts",
        "Researcher console with released aggregates",
        "Evaluation suite, model history, and failure analysis"
      ],
      links: [
        { label: "Demo video", url: "https://youtu.be/6jT3EJk6Cb4" },
        { label: "Repository README", url: "https://github.com/neural-wave/ch-EpsilonDev/blob/main/README.md" },
        { label: "Performance notes", url: "https://github.com/neural-wave/ch-EpsilonDev/blob/main/docs/PERFORMANCE.md" },
        { label: "Model history", url: "https://github.com/neural-wave/ch-EpsilonDev/blob/main/docs/MODEL_HISTORY.md" }
      ]
    },
    bottlenecks: [
      {
        challenge: "A safe-looking query can hide a forbidden request",
        solution: "An intent agent reads the original question in parallel with query generation. The guard analyzes SPARQL algebra, propagates sensitivity through bindings, subqueries, and aggregates, and combines its findings with the intent flags, so a harmless-looking query cannot clear a request that asked for individual patients."
      },
      {
        challenge: "LLM-generated SPARQL that parses but answers the wrong question",
        solution: "A deterministic judge repairs unambiguous syntax, scope, and aggregation errors, then checks observed terms, class/property compatibility, variable scope, and question coverage. Specific errors feed a bounded retry; flagged requests are never retried."
      }
    ],
    evaluationNotes: "Recorded on 18 October 2026 with self-hosted Qwen3.6-27B (4-bit AWQ) on organizer-supplied synthetic cohorts. Privacy-verdict accuracy and query-answer correctness are separate measures: verdicts were 99.3% accurate on development and 100% on holdout, while 53 of 87 query answers matched the reference numbers. These are recorded evaluations, not guarantees for arbitrary questions, and the restricted terminology assets used in the evaluation are not in the public repository.",
    readmeSections: [
      {
        title: "Results at a glance",
        intro: "Recorded with self-hosted Qwen3.6-27B in 4-bit AWQ, v4 prompts, and the evaluated local context assets. Latency covers translation and checking at concurrency four and excludes database execution.",
        table: {
          headers: ["Measure", "Recorded result"],
          rows: [
            ["Privacy verdict accuracy", "99.3% development (148/149); 100% holdout (49/49)"],
            ["Forbidden requests marked compliant", "0/117 across both splits"],
            ["Query answers matching the reference numbers", "53/87, including 20/31 holdout questions"],
            ["Exact query results", "34/87"],
            ["Translation and checking latency", "7.2 s median; 20.1 s p95"]
          ]
        }
      },
      {
        title: "How a request flows",
        bullets: [
          "Validate input: normalize Unicode and whitespace, strip control characters, and reject empty or overlong text.",
          "Classify intent and generate in parallel: the intent agent returns five privacy flags while the query agent writes SPARQL from retrieved examples, schema cards, and terminology candidates.",
          "Repair and check: the deterministic judge fixes unambiguous errors and checks terms, types, scope, and coverage.",
          "Decide compliance: the guard owns the verdict; the judged API returns the query, the verdict, and total token usage, and never touches a database."
        ]
      },
      {
        title: "My contribution",
        bullets: [
          "Backend work on the judge and on hardening the data and retrieval context.",
          "Researcher-console result features: result display, privacy controls, confirmed sharing, and a reproducibility card.",
          "CI/CD: a multi-platform container build with smoke tests, release-file checks, and publishing, plus browser and workflow tests.",
          "The final README, operations handbook, and demo video deliverables."
        ]
      },
      {
        title: "Evaluation limits",
        bullets: [
          "The cohorts are synthetic (2,000 patients for correctness, 100,000 for performance); their counts are evaluation data, not clinical findings.",
          "Matching numbers allow differences in labels, layout, or small rounding; only 34 of 87 answers were exact.",
          "Without the restricted 38,765-code terminology index, a public checkout starts with less context and the recorded scores may not reproduce."
        ]
      }
    ],
    architecture: `Translation & Compliance Pipeline:
├── Input: Unicode normalization, length limits, and a code-only path for greetings
├── Agents: Intent classifier and SPARQL query writer run in parallel on Qwen3.6-27B
├── Context: Local BM25 examples, schema cards, and multilingual terminology candidates
├── Judge: Deterministic repair plus term, type, scope, and coverage checks
└── Guard: SPARQL-algebra privacy analysis for five rules, with bounded retries`,
    stats: [
      { label: "Privacy verdict accuracy (holdout)", value: "100% (49/49)" },
      { label: "Forbidden requests let through", value: "0 / 117" },
      { label: "Median latency", value: "7.2 s" }
    ],
    overview: "Built with Team Epsilon Dev for the SIB/SPHN Neural Wave hackathon 2026. SIB Doc lets researchers ask questions of Swiss Personalized Health Network clinical knowledge graphs in plain language. Two open-source LLM agents translate and classify each request, a deterministic judge repairs and checks the generated SPARQL, and a privacy guard decides whether the query may be released. A separate researcher console can run compliant queries against a development database and show released aggregates.",
    keyModules: [
      { name: "Compliance Guard", desc: "Analyzes SPARQL algebra and intent flags against five patient-privacy rules; a negative verdict includes the reason." },
      { name: "Deterministic Judge", desc: "Repairs and checks generated queries, feeding specific errors back into a bounded retry." },
      { name: "Researcher Console", desc: "Question history, released aggregate tables and charts, exports, and confirmed seven-day sharing links." },
      { name: "CI/CD & Evaluation", desc: "Container smoke tests, release-file checks, and verdict and reference-query evaluations for every model change." }
    ]
  },
  {
    id: "log-triage",
    card: {
      categories: ["llm", "ml"],
      visual: "chunks",
      shelf: "featured",
      kicker: { en: "RECENT · OBSERVABILITY (2026)", de: "AKTUELL · OBSERVABILITY (2026)" },
      badge: "⚡ 5,781 lines/s · 0% hallucination",
      summary: {
        en: "Streaming anomaly detection with trace-aware logs and citation guardrails: 5,781.4 lines/s, 0% citation hallucination rate, and 93.1% lower feature-scoring memory.",
        de: "Streaming-Anomalieerkennung mit Trace-aware Logs und Zitations-Guardrails: 5.781,4 Zeilen/s, 0 % Zitations-Halluzinationsrate und 93,1 % weniger Speicher beim Feature-Scoring."
      },
      chips: ["Python · FastAPI", "OpenTelemetry", "Drain3"],
      cta: { en: "View Results & Architecture ↗", de: "Ergebnisse & Architektur ansehen ↗" }
    },
    title: "Log Triage Assistant",
    subtitle: "Streaming Anomaly Detection & Trustworthy AI (2026)",
    tagline: "Research-grade log analysis pipeline that streams large files, correlates anomalies with trace context, and verifies every AI citation against source lines.",
    githubUrl: "https://github.com/adriennie/log-triage",
    tags: ["Python", "FastAPI", "Drain3", "OpenTelemetry", "SQLite"],
    artifacts: {
      type: "Research & Engineering Artifacts",
      items: [
        "Streaming CLI and NDJSON API",
        "Benchmark reports in Markdown, JSON, and SVG",
        "Citation verification safety audit"
      ],
      links: [
        { label: "Repository README", url: "https://github.com/adriennie/log-triage/blob/main/README.md" },
        { label: "Benchmark report", url: "https://github.com/adriennie/log-triage/blob/main/reports/benchmark_report.md" },
        { label: "OpenAPI service", url: "https://github.com/adriennie/log-triage/blob/main/logtriage/api.py" }
      ]
    },
    architecture: `Streaming Triage Pipeline:
├── Parse: Streaming Drain3 templates with persistent state
├── Window: Bounded log buffers grouped into analysis blocks
├── Score: Batched anomaly scoring with bounded feature matrices
├── Retrieve: SQLite-backed vector cache for recurring templates
└── Guardrail: Citation verification with W3C trace correlation`,
    stats: [
      { label: "Throughput", value: "5,781.4 lines/s" },
      { label: "Citation hallucination rate", value: "0.00%" },
      { label: "Memory reduction", value: "93.1%" }
    ],
    overview: "Built a streaming log triage system for distributed services. It combines Drain3 parsing, bounded-window anomaly scoring, persistent SQLite vector caching, FastAPI streaming endpoints, and OpenTelemetry trace propagation. The system treats citations as a safety boundary: every cited line is checked against the active log window before an explanation is accepted.",
    readmeSections: [
      {
        title: "Live streaming results",
        intro: "The CLI processes the Loghub HDFS_2k dataset incrementally instead of loading the full file into memory. A 2,000-line run completed in four chunks and flagged 52 anomalies; later chunks accelerated after parser state and vector representations were reused.",
        table: {
          headers: ["Run", "Dataset", "Result", "Observed detail"],
          rows: [["stream", "HDFS_2k.log", "2,000 lines / 4 chunks", "52 anomalies flagged"], ["analyze", "HDFS_2k.log", "17 templates / 24 anomalies", "344.8 ms latency"], ["eval", "HDFS_2k.log", "1,994 windows", "0.050 contamination"]]
        }
      },
      {
        title: "Empirical benchmark results",
        intro: "The evaluation suite compares anomaly classification, parsing quality, resource use, and citation safety against the Loghub HDFS benchmark.",
        table: {
          headers: ["Category", "Metric", "Result", "Interpretation"],
          rows: [
            ["Classification", "Precision / Recall / F1", "0.0417 / 0.0033 / 0.0061", "Conservative detector; recall needs improvement"],
            ["Classification", "Specificity / Accuracy", "0.9864 / 0.8365", "Few false positives relative to the benchmark"],
            ["Parsing", "Template accuracy", "71.43%", "17 Drain3 clusters discovered"],
            ["Scalability", "Throughput / latency", "5,781.4 lines/s / 345.93 ms", "Measured on the checked-in evaluation run"],
            ["Resources", "Peak memory", "4.04 MB", "20.22 MB per 10k lines"],
            ["Trustworthy AI", "Hallucination rate", "0.00%", "24/24 citations verified; confidence 1.0000"]
          ]
        }
      },
      {
        title: "System capabilities",
        bullets: [
          "Generator-based parsing and bounded feature batches keep memory tied to the active chunk rather than the complete log.",
          "Drain3 state persistence and a SHA-256 keyed SQLite vector cache reduce repeated parsing and embedding work.",
          "W3C TraceContext propagation connects API requests, structured JSON logs, and pipeline stages through trace IDs.",
          "Citation guardrails reject explanations when generated line references do not exist in the active source window."
        ]
      },
      {
        title: "Evaluation limits",
        bullets: [
          "The reported F1 score of 0.0061 and recall of 0.0033 show that anomaly classification is an active research result, not a production-ready detector.",
          "The benchmark is based on the checked-in HDFS_2k dataset and should be rerun across additional services and log distributions.",
          "The 93.1% memory reduction compares batched feature scoring with the project baseline; it is not a guarantee for every deployment."
        ]
      }
    ],
    keyModules: [
      { name: "Streaming Pipeline", desc: "Processes multi-gigabyte logs chunk by chunk with Drain3 template persistence and bounded memory." },
      { name: "Citation Safety", desc: "Verifies every cited source line and emits a structured guardrail payload before returning an explanation." },
      { name: "Observability", desc: "Propagates W3C trace context through FastAPI middleware and structured pipeline logs." },
      { name: "Evaluation Suite", desc: "Exports classification, parsing, latency, throughput, memory, and citation-safety metrics." }
    ]
  },
  {
    id: "vllm-pagedattention-benchmark",
    card: {
      categories: ["llm"],
      visual: "throughput",
      shelf: "featured",
      kicker: { en: "INFERENCE OPTIMIZATION (2026)", de: "INFERENZOPTIMIERUNG (2026)" },
      badge: "🚀 5.06× throughput (BS=32)",
      summary: {
        en: "At batch 32, vLLM measured 5.06x the Transformers row and 1.43x a separate generate() row.",
        de: "Bei Batch 32 erreichte vLLM das 5,06-Fache des Transformers-Laufs und das 1,43-Fache eines separaten generate()-Laufs."
      },
      chips: ["vLLM", "PyTorch", "Tesla T4"]
    },
    title: "vLLM PagedAttention & Hugging Face Unified Benchmark Suite",
    subtitle: "Empirical Inference Benchmarking · NVIDIA Tesla T4 (2026)",
    tagline: "A reproducible notebook suite comparing vLLM PagedAttention with two Hugging Face inference paths across batch sizes, throughput, request rate, and recorded runtime conditions.",
    githubUrl: "https://github.com/adriennie/vllm-pagedattention-benchmark",
    tags: ["vLLM", "PyTorch", "CUDA", "NVIDIA T4", "Qwen 2.5"],
    artifacts: {
      type: "Open Science Artifacts",
      items: [
        "final_vllm_vs_hf_benchmark.csv",
        "results/run_metadata.csv",
        "vllm_vs_hf_final_comparison.png"
      ],
      links: [
        { label: "Combined results CSV", url: "https://github.com/adriennie/vllm-pagedattention-benchmark/blob/main/final_vllm_vs_hf_benchmark.csv" },
        { label: "Run metadata", url: "https://github.com/adriennie/vllm-pagedattention-benchmark/blob/main/results/run_metadata.csv" },
        { label: "Benchmark notebook", url: "https://github.com/adriennie/vllm-pagedattention-benchmark/blob/main/vllm_vs_hf_benchmark.ipynb" },
        { label: "Repository README", url: "https://github.com/adriennie/vllm-pagedattention-benchmark/blob/main/readme.md" }
      ]
    },
    bottlenecks: [
      {
        challenge: "KV-Cache Memory Fragmentation",
        solution: "PagedAttention maps logical KV-cache blocks to physical GPU blocks rather than requiring one contiguous cache allocation per sequence. This project compares the runtimes, but does not isolate the effect of PagedAttention from scheduling, kernels, and other runtime differences."
      },
      {
        challenge: "Throughput Bottlenecks under Concurrency",
        solution: "The experiment varies request batch size and records aggregate throughput, request rate, and aggregate seconds per generated token per request. It does not measure TTFT, TPOT, or tail-latency percentiles, so these figures should not be read as a production serving latency evaluation."
      }
    ],
    evaluationNotes: "At batch 32, the combined CSV records 877.69 tok/s for vLLM, 173.45 tok/s for the Hugging Face Transformers row (5.06x), and 613.65 tok/s for a separate Hugging Face generate() row (1.43x). These are distinct benchmark paths/runs. The vLLM PyTorch VRAM counters are 0.0 and mean unrecorded memory, not zero usage. Runtime versions and run conditions were not pinned; treat results as notebook measurements, not a controlled serving benchmark.",
    readmeSections: [
      {
        title: "Benchmark results",
        intro: "Checked-in combined CSV values from the Tesla T4 notebook comparison. The two Hugging Face rows are separate paths/runs; the 5.06x and 1.43x batch-32 comparisons use different baselines.",
        image: { src: "https://raw.githubusercontent.com/adriennie/vllm-pagedattention-benchmark/main/vllm_vs_hf_final_comparison.png", alt: "Repository chart comparing vLLM and Hugging Face throughput and memory counters across batch sizes", caption: "Repository plot. The vLLM VRAM counters show zero because memory was not captured; they do not indicate zero GPU memory use." },
        table: {
          headers: ["Batch", "HF Transformers tok/s", "vLLM tok/s", "vLLM / Transformers", "HF generate() tok/s", "vLLM / generate()"],
          rows: [["1", "18.77", "30.05", "1.60x", "19.72", "1.52x"], ["2", "18.19", "50.13", "2.76x", "42.87", "1.17x"], ["4", "36.04", "116.06", "3.22x", "83.91", "1.38x"], ["8", "61.42", "226.98", "3.70x", "163.31", "1.39x"], ["16", "107.00", "270.61", "2.53x", "325.02", "0.83x"], ["32", "173.45", "877.69", "5.06x", "613.65", "1.43x"]]
        }
      },
      {
        title: "Workload and environment",
        bullets: ["Model: Qwen/Qwen2.5-1.5B-Instruct, FP16; batch sizes 1, 2, 4, 8, 16, and 32; up to 128 new tokens with greedy decoding.", "The vLLM notebook uses Engine V0, a 16-token cache block, eager execution, a 2,048-token context limit, and 0.80 GPU memory utilization.", "Recorded run metadata: Python 3.13.15, PyTorch 2.11.0+cu128, CUDA 12.8, NVIDIA Tesla T4. These are observed runtime versions, not pinned requirements."]
      },
      {
        title: "Other recorded metrics and memory notes",
        bullets: ["The CSV also records aggregate request rate and aggregate seconds per generated token per request. The latter is not a per-token latency distribution and does not include TTFT, TPOT, or P95/P99.", "Hugging Face Transformers peak allocated VRAM ranges from 3.47 GB to 3.80 GB across the listed batches. vLLM's CSV allocator counters are 0.0 for every batch and are not a valid memory measurement.", "A common device-level memory measurement is needed for a meaningful GPU memory comparison."]
      },
      {
        title: "Interpretation and limits",
        bullets: ["These are aggregate notebook measurements, not results from a controlled serving benchmark. The recorded seconds/token/request metric is not per-token latency and does not include TTFT, TPOT, or P95/P99.", "Hugging Face results vary by benchmark path: the second batch-32 row is 613.65 tok/s, so the comparison to vLLM is 1.43x, not 5.06x.", "The vLLM VRAM values are recorded as 0.0 by PyTorch allocator counters and must be treated as missing, not real device memory use. A common device-level measurement is needed for memory comparison.", "The test does not isolate PagedAttention from scheduling, kernels, and other runtime differences."]
      }
    ],
    architecture: `Pipeline & Execution Flow:
├── Base Model: Qwen/Qwen2.5-1.5B-Instruct (FP16)
├── Runtime Comparison: Hugging Face Transformers (generate()) vs. vLLM (LLM.generate())
└── Hardware: Google Colab & Kaggle notebooks on NVIDIA Tesla T4 GPUs`,
    stats: [
      { label: "Max Speedup vs. HF Transformers", value: "5.06x Throughput" },
      { label: "Peak Generation", value: "877.69 tok/s (Batch 32)" },
      { label: "Hardware", value: "NVIDIA Tesla T4 (FP16)" }
    ],
    overview: "This suite makes the comparison legible instead of collapsing it into one speedup claim: the same Qwen2.5-1.5B-Instruct workload is replayed across batch sizes 1–32 on a Tesla T4, with separate rows for Transformers and generate(). At batch 32, vLLM reaches 877.69 tok/s; the comparison depends on which Hugging Face path is used.",
    keyModules: [
      { name: "Hugging Face Path", desc: "PyTorch model executed via model.generate() with standard KV memory allocation." },
      { name: "vLLM Path", desc: "vLLM engine utilizing block-managed KV memory with continuous batching." }
    ]
  },
  {
    id: "vllm-lora-extension",
    card: {
      categories: ["llm"],
      visual: "ranks",
      shelf: "featured",
      kicker: { en: "PEFT & ADAPTER-ROUTING (2026)", de: "PEFT & ADAPTER-ROUTING (2026)" },
      badge: "⚙️ 3 adapters · 1 engine",
      summary: {
        en: "Trained LoRA adapters (ranks 4, 8, 16) and served all three adapters from one vLLM engine using LoraRequest routing.",
        de: "LoRA-Adapter (Ränge 4, 8, 16) trainiert und alle drei über eine vLLM-Engine mit LoraRequest-Routing bereitgestellt."
      },
      chips: ["PEFT", "LoRA", "vLLM"]
    },
    title: "LoRA Rank Ablation & Multi-Adapter Evaluation with PEFT",
    subtitle: "Parameter-Efficient Fine-Tuning · Dynamic Adapter Routing (2026)",
    tagline: "A small PEFT study that compares LoRA ranks 4, 8, and 16, then routes the saved adapters through one shared vLLM engine with LoraRequest.",
    githubUrl: "https://github.com/adriennie/vllm-lora-extension",
    tags: ["vLLM", "PEFT", "LoRA", "PyTorch", "TRL"],
    artifacts: {
      type: "Open Science Artifacts",
      items: [
        "Saved adapters for ranks 4, 8, and 16",
        "results/lora_rank_ablation.csv",
        "results/lora_rank_ablation.png",
        "vllm_evaluation_results.json"
      ],
      links: [
        { label: "Rank metrics CSV", url: "https://github.com/adriennie/vllm-lora-extension/blob/main/results/lora_rank_ablation.csv" },
        { label: "Rank plot", url: "https://github.com/adriennie/vllm-lora-extension/blob/main/results/lora_rank_ablation.png" },
        { label: "Saved inference outputs", url: "https://github.com/adriennie/vllm-lora-extension/blob/main/vllm_evaluation_results.json" },
        { label: "Training notebook", url: "https://github.com/adriennie/vllm-lora-extension/blob/main/qwen_lora_rank_ablation.ipynb" },
        { label: "Serving notebook", url: "https://github.com/adriennie/vllm-lora-extension/blob/main/qwen_vllm_multi_adapter_serving.ipynb" },
        { label: "Repository README", url: "https://github.com/adriennie/vllm-lora-extension/blob/main/README.md" }
      ]
    },
    bottlenecks: [
      {
        challenge: "Multi-Adapter Routing Overhead",
        solution: "Serving multiple fine-tuned models typically requires maintaining separate GPU worker instances, drastically increasing VRAM costs. Leveraged vLLM's `LoraRequest` mechanism to dynamically route requests through a single shared base model engine while swapping low-rank weight matrices on the fly."
      },
      {
        challenge: "Rank vs. Generalization Trade-offs",
        solution: "Evaluated ranks 4, 8, and 16, with trainable parameter counts from 0.54M to 2.18M. The experiment used four unique training examples and tracked training loss only, so it does not establish generalization or an optimal rank."
      }
    ],
    evaluationNotes: "The rank notebook repeats four unique examples 25 times (100 rows) and runs each rank once. The loss is training loss, with no held-out evaluation. The vLLM notebook demonstrates routing but does not benchmark memory, throughput, or latency; its one-prompt outputs also do not establish factuality or faithfulness.",
    readmeSections: [
      {
        title: "Rank ablation results",
        intro: "Values transcribed from the repository CSV. Four hand-written examples were repeated 25 times (100 rows); each rank was run once, so this is a small exploratory training ablation.",
        image: { src: "https://raw.githubusercontent.com/adriennie/vllm-lora-extension/main/results/lora_rank_ablation.png", alt: "Repository plots of trainable parameter count and final training loss for LoRA ranks 4, 8, and 16", caption: "Repository plot generated by the rank-ablation notebook. Loss values are training loss, not held-out quality scores." },
        table: {
          headers: ["Rank", "Trainable parameters", "Trainable (%)", "Training time (s)", "Peak VRAM (GB)", "Final training loss"],
          rows: [["4", "544,768", "0.0353%", "55.50", "6.55", "2.4458"], ["8", "1,089,536", "0.0705%", "47.83", "4.76", "2.4438"], ["16", "2,179,072", "0.1410%", "48.55", "4.77", "2.4248"]]
        }
      },
      {
        title: "One-prompt inference example",
        intro: "Input prompt: “PagedAttention stops GPU memory from being wasted when generating text.” These saved outputs illustrate routing only; the repo does not treat them as a controlled quality evaluation.",
        table: {
          headers: ["Model", "Saved output"],
          rows: [["Base model", "The software PagedAttention effectively prevents GPU memory from being inefficiently utilized during the generation of text."], ["Adapter r=4", "PagedAttention effectively prevents GPU memory leaks during the generation of textual data by ensuring that the allocated memory is reused efficiently."], ["Adapter r=8", "PagedAttention effectively prevents GPU memory wastage by ensuring that only necessary model parameters are loaded into memory during text generation."], ["Adapter r=16", "PagedAttention effectively prevents GPU memory wastage during text generation by ensuring that only necessary data is retained in memory."]]
        }
      },
      {
        title: "Serving and interpretation",
        bullets: ["The serving notebook registers three adapters with LoRARequest handles and selects one per request through a shared vLLM engine.", "The saved adapters and logs are project artifacts; the serving example is a notebook demonstration, not a production service.", "The repository does not benchmark serving memory, throughput, or latency against per-adapter model loading. Training-loss differences do not establish generalization or a best rank."]
      },
      {
        title: "Next steps",
        bullets: ["Add a held-out evaluation set and report task-quality metrics.", "Repeat rank comparisons across multiple seeds.", "Benchmark adapter routing with controlled serving workloads and recorded runtime versions."]
      }
    ],
    architecture: `Adapter Routing Pipeline:
├── Training: Hugging Face TRL/PEFT training across ranks 4, 8, and 16 on Qwen/Qwen2.5-1.5B-Instruct
├── Storage: Saved adapter checkpoints and parameter, timing, VRAM, and loss logs
└── Serving: vLLM multi-adapter inference handling concurrent requests via LoraRequest`,
    stats: [
      { label: "Ranks Tested", value: "r = 4, 8, 16" },
      { label: "Trainable Params", value: "544,768 to 2,179,072 (0.0353% - 0.1410%)" },
      { label: "Serving Architecture", value: "Single Engine + LoraRequest" }
    ],
    overview: "This repository connects two experiments: a rank ablation for q_proj and v_proj updates on Qwen2.5-1.5B-Instruct, and a multi-adapter serving demonstration using one vLLM engine. The evaluation is intentionally small: four unique examples, one run per rank, and no held-out quality set.",
    keyModules: [
      { name: "LoRA Training Ablation", desc: "Frozen base weights with low-rank updates via PEFT SFTTrainer." },
      { name: "Multi-Adapter Serving", desc: "Dynamic runtime adapter loading and routing without engine re-initialization." }
    ]
  },
  {
    id: "ecoshare",
    card: {
      categories: ["products", "ml"],
      visual: "flow",
      shelf: "more",
      kicker: { en: "B.TECH MAJOR PROJECT 1 · GROUP (2025 – 2026)", de: "B.TECH-HAUPTPROJEKT 1 · GRUPPE (2025 – 2026)" },
      badge: "👥 Group project",
      summary: {
        en: "Neighbourhood sharing app that keeps food and household items out of the bin: AI drafts a listing from a photo, a pgvector feed finds what's nearby, and a one-time pickup code makes the handover safe.",
        de: "Nachbarschafts-App, die Lebensmittel und Haushaltsgegenstände vor dem Müll bewahrt: KI erstellt Inserate aus einem Foto, ein pgvector-Feed findet Angebote in der Nähe, ein Einmal-Abholcode sichert die Übergabe."
      },
      chips: ["Expo SDK 58", "Express · Supabase", "FastAPI · Hugging Face"],
      cta: { en: "View project ↗", de: "Projekt ansehen ↗" }
    },
    title: "EcoShare",
    subtitle: "B.Tech CSE Major Project 1 · Group Project (2025 – 2026)",
    tagline: "A neighbourhood sharing app for food and household items: list from a photo with AI, find what's nearby, and hand it over safely for free or for community credits.",
    githubUrl: "https://github.com/adriennie/EcoShare-App",
    tags: ["Expo SDK 58", "TypeScript", "Express 5", "Supabase", "pgvector", "FastAPI", "Hugging Face"],
    video: { youtubeId: "TNaDs7s6ITM", title: "EcoShare one-minute demo", poster: "projects/ecoshare/demo-thumbnail.jpg" },
    artifacts: {
      type: "Repository Highlights",
      items: [
        "Expo app, Express API, and FastAPI ML service",
        "Supabase schema with row-level security and pgvector",
        "CI, weekly MLOps workflow, and secret scanning"
      ],
      links: [
        { label: "Demo video", url: "https://youtu.be/TNaDs7s6ITM" },
        { label: "Repository README", url: "https://github.com/adriennie/EcoShare-App/blob/main/README.md" }
      ]
    },
    bottlenecks: [
      {
        challenge: "Listing an item takes too long, so people bin it instead",
        solution: "A photo becomes a draft listing (title, category, allergens, storage tip, shelf life). Open Hugging Face models do the drafting: a hosted vision-language model, or CLIP and BLIP running locally for free. The owner reviews every field before publishing."
      },
      {
        challenge: "Handovers between strangers need trust",
        solution: "Every exchange is confirmed with a one-time 6-digit pickup code. Only its bcrypt hash is stored, it expires, and it locks after five attempts. Credits move only when the code is accepted, through an append-only double-entry ledger."
      },
      {
        challenge: "AI features must never block the app",
        solution: "All model calls go through one ML service that holds the Hugging Face token. Every call has a timeout and a fallback, so listings, the feed, and moderation keep working when a model is unavailable."
      }
    ],
    evaluationNotes: "EcoShare is a group project built for B.Tech CSE Major Project 1. It runs with demo data rather than a live community. The README notes that local CLIP picked the right category for 14 of 14 demo photos, which is a small check rather than an accuracy benchmark.",
    readmeSections: [
      {
        title: "Features",
        bullets: [
          "Snap and AI fills it in: category, caption, allergens, and storage tips drafted from a photo.",
          "A \"For you\" feed ranked by interests, distance, and freshness, with candidates from pgvector similarity and a learned ranker.",
          "Realtime request and chat, with every message screened by a toxicity model; flagged messages are held for review.",
          "Community credits with holds at accept time and idempotent settlement, plus impact tracking in kg CO₂e avoided."
        ]
      },
      {
        title: "Stack",
        table: {
          headers: ["Layer", "Technology"],
          rows: [
            ["App", "Expo SDK 58, React Native, Expo Router, TypeScript, Reanimated"],
            ["API", "Node 20+, Express 5, zod, pino, helmet, rate limiting"],
            ["Data", "Supabase: Postgres, row-level security, pgvector, Storage, Realtime"],
            ["AI / ML", "FastAPI, Hugging Face (hosted or local), PyTorch, scikit-learn, LightGBM, MLflow"],
            ["Delivery", "Docker Compose, GitHub Actions (CI, weekly MLOps, gitleaks)"]
          ]
        }
      },
      {
        title: "Scope and limits",
        bullets: [
          "Built as a team for a B.Tech major project; it is a working prototype with demo data, not a deployed service.",
          "Model quality checks are small and informal; the reliability badge is shown to users but never used to block anyone."
        ]
      }
    ],
    architecture: `Application Architecture:
├── App: Expo Router screens for listings, feed, chat, credits, and impact
├── API: Express 5 service that verifies the Supabase session on every request
├── Data: Supabase Postgres with row-level security, pgvector, Storage, and Realtime
└── ML service: FastAPI calling Hugging Face models, each with a timeout and fallback`,
    preview: {
      eyebrow: "HOW THE APP FITS TOGETHER",
      title: "From a photo to a safe handover",
      note: "Architecture overview based on the repository README.",
      steps: [
        { label: "Snap", detail: "A photo becomes a draft listing that the owner reviews." },
        { label: "Discover", detail: "A nearby feed ranked by interests, distance, and freshness." },
        { label: "Request", detail: "One-tap request and realtime chat with toxicity screening." },
        { label: "Hand over", detail: "A one-time pickup code releases the credits." }
      ],
      capabilities: ["AI listings", "pgvector feed", "Realtime chat", "Credit ledger", "Moderation"]
    },
    stats: [
      { label: "Project", value: "Major Project 1 · Group" },
      { label: "AI calls", value: "Timeout + fallback on every call" },
      { label: "Pickup code", value: "6 digits · locks after 5 tries" }
    ],
    overview: "Good food and household items get thrown away every day while a neighbour a few streets away could have used them. EcoShare, built as a group for B.Tech CSE Major Project 1, makes passing something on as easy as taking a photo and makes the handover trustworthy: AI drafts the listing, a ranked feed surfaces nearby items, and a one-time pickup code confirms every exchange.",
    keyModules: [
      { name: "AI Listing Drafts", desc: "Vision-language or local CLIP and BLIP models turn a photo into a reviewable listing." },
      { name: "Nearby Feed", desc: "pgvector similarity candidates ordered by a learned ranker, with a heuristic fallback." },
      { name: "Safe Handover", desc: "Hashed one-time pickup codes and an append-only credit ledger." },
      { name: "Trust & Safety", desc: "Toxicity and image moderation, food-safety rules, reports, and an admin queue." }
    ]
  },
  {
    id: "swasthya",
    card: {
      categories: ["products", "ml"],
      visual: "screenshot",
      shelf: "more",
      title: "Swasthya Pharmacy Network",
      kicker: { en: "B.TECH MAJOR PROJECT 2 · GROUP (2025 – 2026)", de: "B.TECH-HAUPTPROJEKT 2 · GRUPPE (2025 – 2026)" },
      badge: "👥 Group project · ▶ demo",
      summary: {
        en: "Pharmacy supply network that forecasts demand, suggests reorders, and connects pharmacies, distributors, and admins. FastAPI ML service in Docker, Supabase with row-level security.",
        de: "Apotheken-Liefernetzwerk, das Nachfrage prognostiziert, Nachbestellungen vorschlägt und Apotheken, Händler und Admins verbindet. FastAPI-ML-Dienst in Docker, Supabase mit Row-Level-Security."
      },
      chips: ["Expo SDK 58", "Supabase RLS", "FastAPI · Docker"],
      cta: { en: "View project ↗", de: "Projekt ansehen ↗" }
    },
    title: "Swasthya",
    subtitle: "B.Tech CSE Major Project 2 · Group Project (2025 – 2026)",
    tagline: "Keeps neighbourhood pharmacy shelves stocked: a 7-day demand forecast flags what will run out, suggests how much to reorder, and routes one-tap orders to the pharmacy's distributor.",
    githubUrl: "https://github.com/adriennie/swasth-app",
    tags: ["Expo SDK 58", "React Native", "TypeScript", "Supabase RLS", "FastAPI", "LightGBM", "Docker"],
    video: { youtubeId: "3o5NiLXtHKs", title: "Swasthya one-minute product demo", poster: "projects/swasthya/demo-thumbnail.jpg" },
    gallery: [
      { src: "projects/swasthya/demo-pharmacy.jpg", alt: "Pharmacy dashboard with AI reorder suggestions ranked by urgency", caption: "Pharmacy · forecast-backed reorder suggestions" },
      { src: "projects/swasthya/demo-ordering.jpg", alt: "Catalog with search, category filters, margins and a live cart", caption: "Ordering · 250-product catalog with live cart" },
      { src: "projects/swasthya/demo-distributor.jpg", alt: "Distributor order timeline with a one-time delivery code", caption: "Distributor · order lifecycle and delivery codes" },
      { src: "projects/swasthya/demo-admin.jpg", alt: "Admin network overview with an anomaly alert on an unusually large order", caption: "Admin · network overview and anomaly alerts" }
    ],
    artifacts: {
      type: "Repository Highlights",
      items: [
        "Role-based Expo Router app for pharmacies, distributors, and admins",
        "Supabase schema with row-level security, seed scripts, and demo data",
        "Dockerized FastAPI ML service, ready for a Hugging Face Space"
      ],
      links: [
        { label: "Demo video", url: "https://youtu.be/3o5NiLXtHKs" },
        { label: "Repository README", url: "https://github.com/adriennie/swasth-app/blob/main/README.md" },
        { label: "Database schema", url: "https://github.com/adriennie/swasth-app/blob/main/supabase/migrations/20261025000000_init_schema.sql" },
        { label: "ML API", url: "https://github.com/adriennie/swasth-app/tree/main/swasthya-api" }
      ]
    },
    bottlenecks: [
      {
        challenge: "Stockouts from guessed reorders",
        solution: "A LightGBM model behind a FastAPI service produces a 7-day demand forecast for the lowest-stock items. The dashboard ranks them by days of stock left and suggests a reorder quantity and order value."
      },
      {
        challenge: "Four roles sharing one database without leaking data",
        solution: "Postgres row-level security limits every table to its owner, mapped partners, and admins. A business's profile id is its auth user id, so ownership checks are the same across tables, and new accounts stay pending until an admin approves them."
      },
      {
        challenge: "Unusual orders slipping through",
        solution: "An Isolation Forest model in the same ML service flags unusually large orders so admins can review them before fulfilment."
      }
    ],
    evaluationNotes: "Swasthya is a group project built for B.Tech CSE Major Project 2. It is a working prototype seeded with demo data (250 products and 90 days of generated order history), not a deployed pharmacy system. The forecasts and anomaly flags come from models served by the ML API; the repository does not report forecast accuracy against real pharmacy sales.",
    readmeSections: [
      {
        title: "What each role can do",
        bullets: [
          "Pharmacy: a \"Today at a glance\" dashboard, forecast-backed reorder suggestions, inventory with batches and expiry dates, and delivery-code order tracking.",
          "Ordering: a 250-product catalog across 17 categories with search by name, salt, SKU, or manufacturer, plus price, MRP, and margin on every row.",
          "Distributor: a fulfilment hub with the order lifecycle (placed → confirmed → shipped → delivered) and one-time delivery codes.",
          "Admin: network overview, an approval queue for new businesses, pharmacy–distributor mapping, and anomaly alerts."
        ]
      },
      {
        title: "Stack",
        table: {
          headers: ["Layer", "Technology"],
          rows: [
            ["App", "Expo SDK 58, React Native 0.88, React 19, Expo Router, TypeScript"],
            ["Backend", "Supabase: Postgres, Auth, Storage, row-level security"],
            ["ML", "FastAPI, LightGBM demand forecasting, scikit-learn Isolation Forest"],
            ["Infrastructure", "Docker; Hugging Face Spaces or AWS Lambda"]
          ]
        }
      },
      {
        title: "Scope and limits",
        bullets: [
          "Demo data is generated, so dashboards show realistic shapes rather than real pharmacy behaviour.",
          "Customer-facing screens (cycle tracker, health quiz, learning content, and a rule-based assistant) share the design system but sit outside the B2B pilot scope.",
          "Forecast accuracy has not been evaluated on real sales data."
        ]
      }
    ],
    architecture: `Application Architecture:
├── App: Expo Router screens for pharmacy, distributor, and admin roles on Android, iOS, and web
├── Data: Supabase Postgres with row-level security, Auth, and Storage for product images
├── ML API: FastAPI service in Docker, deployable to a Hugging Face Space
├── Forecasting: LightGBM 7-day demand forecast drives reorder suggestions
└── Anomalies: Isolation Forest flags unusually large orders for admin review`,
    stats: [
      { label: "Catalog", value: "250 products" },
      { label: "Forecast horizon", value: "7 days" },
      { label: "Roles", value: "3 business roles + admin approval" }
    ],
    overview: "Patients walk into neighbourhood pharmacies for medicines they need today and find the shelf empty, because reorders are guessed, near-expiry batches go unnoticed, and orders still go out by phone. Swasthya, built as a group for B.Tech CSE Major Project 2, connects pharmacies, distributors, and admins in one app: the pharmacy sees what will run out before the next delivery, orders in one tap, and the distributor fulfils with a verified delivery code.",
    keyModules: [
      { name: "Reorder Intelligence", desc: "7-day LightGBM demand forecast for low-stock items, ranked by urgency with suggested quantities and order values." },
      { name: "Role-Based Access", desc: "Postgres row-level security scoped to owners, mapped partners, and admins, with admin approval for new businesses." },
      { name: "Ordering & Fulfilment", desc: "Catalog search, live cart, distributor routing, and one-time delivery codes." },
      { name: "Anomaly Review", desc: "Isolation Forest checks that surface unusually large orders on the admin dashboard." }
    ]
  },
  {
    id: "astronomical-image-processing",
    card: {
      categories: ["ml"],
      visual: "none",
      shelf: "more",
      title: "Astronomical Denoising: What Went Wrong",
      kicker: { en: "LEARNING PROJECT · DEEP LEARNING (2024 – 2025)", de: "LERNPROJEKT · DEEP LEARNING (2024 – 2025)" },
      badge: "📚 Post-mortem",
      summary: {
        en: "My first end-to-end deep learning study. Looking back, the denoiser collapsed to an all-black output and the detection scores were random placeholders, so I treat it as a lesson in evaluation.",
        de: "Meine erste durchgängige Deep-Learning-Studie. Rückblickend lieferte der Denoiser nur schwarze Bilder und die Detektionswerte waren zufällige Platzhalter – heute ein Lehrstück über Evaluation."
      },
      chips: ["TensorFlow / Keras", "Autoencoder", "Evaluation"],
      cta: { en: "Read the post-mortem ↗", de: "Post-Mortem lesen ↗" }
    },
    title: "Astronomical Denoising & Detection",
    subtitle: "Learning Project · Deep Learning (2024 – 2025)",
    tagline: "A convolutional autoencoder and a small YOLO-style detector for noisy telescope images. The headline results did not hold up: this page explains why, and what I would do differently.",
    githubUrl: "https://github.com/adriennie/Astronomical-Image-Processing",
    tags: ["TensorFlow / Keras", "OpenCV", "Python", "Autoencoder"],
    artifacts: {
      type: "Original Artifacts",
      items: [
        "Training and evaluation notebook",
        "LaTeX manuscript (reports the original numbers)",
        "Figures, including the black denoised outputs"
      ],
      links: [
        { label: "Notebook", url: "https://github.com/adriennie/Astronomical-Image-Processing/blob/main/astronomical-image-processing-and-noise-reduction.ipynb" }
      ]
    },
    bottlenecks: [
      {
        challenge: "The denoiser learned to output black",
        solution: "Validation loss stopped at 0.0112 within the first epochs and never moved. The images are mostly dark sky, so predicting near-zero everywhere already gives a low mean squared error. The paper's own figures show black \"denoised\" panels, and the difference image |clean − denoised| looks identical to the clean image."
      },
      {
        challenge: "The detection scores were not measured",
        solution: "The detector was trained on all-zero dummy labels, and the reported IoU values come from np.random.uniform(0.4, 0.8) in the notebook. The paper's 0.51 → 0.69 improvement, described as overlap with ground-truth boxes, therefore says nothing about detection."
      },
      {
        challenge: "The headline and baseline numbers were typed in",
        solution: "The notebook plots PSNR and SSIM per test image but never computes the 27.52 dB and 0.88 averages; those values, and every number for DnCNN, U-Net, YOLOv1, and a plain autoencoder, are entered by hand in the comparison chart. The paper says each baseline was tested on the same data, but the notebook never runs them, and two baseline IoU values differ between the chart and the paper. Per-image scores also stay high for a black output, because the images are mostly black."
      }
    ],
    evaluationNotes: "None of the original results should be read as evidence that the method works: the denoiser output collapsed to black, the IoU values were random placeholders, and the baseline numbers were hard-coded. The accompanying paper reports those same numbers. The project stays on this site as a learning project because finding these problems taught me more about evaluation than the original results would have.",
    readmeSections: [
      {
        title: "What was built",
        bullets: [
          "Images from the DeepSpaceYOLO dataset resized to 128 × 128, with synthetic Gaussian noise (σ = 0.2) added as input.",
          "A 49,731-parameter convolutional autoencoder (Conv2D / UpSampling2D, sigmoid output) trained with mean squared error for 20 epochs.",
          "A small CNN that predicts a 16 × 16 grid of box outputs, intended as a YOLO-style detector."
        ]
      },
      {
        title: "What I learned",
        bullets: [
          "Look at the outputs, not just the loss. A flat validation loss and black sample images were visible in the notebook all along.",
          "Pick metrics that a trivial baseline can't win. On mostly-dark images, PSNR rewards predicting darkness, so an all-zero and an identity baseline belong next to every score.",
          "Never let placeholder code produce reportable numbers. Random or dummy values should fail loudly or be labelled in the output itself.",
          "Every number in a table should come from a run that can be re-executed, with its seed and configuration recorded."
        ]
      },
      {
        title: "Next steps",
        bullets: [
          "Re-run with a loss that cannot be minimized by predicting black (for example, weighting bright pixels or using a perceptual loss), and compare against all-zero and identity baselines.",
          "Replace the dummy labels with real annotations and report precision, recall, and IoU from actual detections.",
          "Evaluate across multiple seeds and noise levels, and compute every baseline from code instead of entering it by hand."
        ]
      }
    ],
    architecture: `Original Two-Stage Pipeline:
├── Input: 128 × 128 DeepSpaceYOLO images with synthetic Gaussian noise (σ = 0.2)
├── Denoiser: Convolutional autoencoder trained with MSE; collapsed to near-black output
└── Detector: 16 × 16 grid CNN trained on all-zero dummy labels; never evaluated on real boxes`,
    stats: [
      { label: "Status", value: "Learning project" },
      { label: "Denoiser validation loss", value: "Flat at 0.0112" },
      { label: "Detection labels", value: "Dummy (all zeros)" }
    ],
    overview: "This was my first attempt at an end-to-end deep learning study: denoise noisy telescope images with a convolutional autoencoder, then detect objects in the cleaned images. I originally reported 27.52 dB PSNR, 0.88 SSIM, and a mean IoU rising from 0.51 to 0.69. Re-reading the notebook later, none of those numbers hold up: the denoiser produced near-black images, the IoU values were random, and the comparison baselines were typed in by hand.",
    keyModules: [
      { name: "Denoising Autoencoder", desc: "Encoder–decoder network trained with MSE. Its outputs collapsed to near-black, which mostly-dark images make look like a good score." },
      { name: "Grid Detector", desc: "Small CNN predicting a 16 × 16 grid of boxes, trained only on dummy all-zero targets." }
    ]
  }
];
