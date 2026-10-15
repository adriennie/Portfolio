export const projects = [
  {
    id: "log-triage",
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
    title: "EcoShare",
    subtitle: "Community Sharing & Credit App",
    tagline: "A mobile-first community marketplace for sharing items, managing orders, and transferring community credits.",
    githubUrl: "https://github.com/adriennie/EcoShare-App",
    tags: ["Expo / React Native", "TypeScript", "Bun", "Supabase", "Clerk"],
    artifacts: {
      type: "Repository Highlights",
      items: [
        "Mobile-first Expo application",
        "Credit transfer API and transaction history",
        "Clerk authentication with Supabase data and storage"
      ]
    },
    architecture: `Application Architecture:
├── Mobile Client: Expo Router screens for listings, orders, credits, and community navigation
├── Backend API: Bun service for credit transfers and transaction history
└── Platform Services: Clerk authentication; Supabase Postgres, Storage, and row-level security`,
    preview: {
      eyebrow: "HOW THE APP FITS TOGETHER",
      title: "From community listing to credit transfer",
      note: "Architecture overview based on the repository README. This is a project map, not a live app preview.",
      steps: [
        { label: "Explore", detail: "Browse community item listings and rewards in the Expo mobile app." },
        { label: "Sign in", detail: "Clerk handles email/password or Google sign-in; user data syncs to Supabase." },
        { label: "Act", detail: "Create listings, manage orders, or request a credit transfer through the Bun API." },
        { label: "Persist", detail: "Supabase stores application data and item images, with RLS policies for access." }
      ],
      capabilities: ["Item listings", "Order management", "Credit transfers", "Rewards", "Image uploads"]
    },
    stats: [
      { label: "Client", value: "Expo / React Native" },
      { label: "Backend", value: "Bun API" },
      { label: "Sign-in", value: "Clerk + Supabase" }
    ],
    overview: "EcoShare (the ReVive repository) is a mobile-first community marketplace where people can list food and non-food items, manage orders, and use community credits. The app combines an Expo / React Native client with a Bun API and Supabase services, with Clerk providing authentication.",
    keyModules: [
      { name: "Community Marketplace", desc: "Create and browse item listings, upload item images, and manage orders." },
      { name: "Credit Economy", desc: "Transfer credits, inspect transaction history, and redeem rewards through the platform." }
    ]
  },
  {
    id: "swasthya",
    title: "Swasthya",
    subtitle: "Intelligent Pharmacy Network (2025 – 2026)",
    tagline: "A mobile pharmacy network connecting customers, pharmacies, distributors, and administrators through role-specific workflows.",
    githubUrl: "https://github.com/adriennie/swasth-app",
    tags: ["Expo / React Native", "TypeScript", "Supabase", "External ML API"],
    artifacts: {
      type: "Repository Highlights",
      items: [
        "Role-based Expo Router application",
        "Supabase schema and database setup scripts",
        "Forecasting and anomaly-check integrations documented in the repository"
      ]
    },
    architecture: `Application Architecture:
├── Mobile Client: Expo Router with consumer, pharmacy, distributor, and admin screens
├── Data Layer: Supabase Auth and PostgreSQL accessed by role-specific app workflows
└── Reasoning & ML: Local deterministic health helpers plus an external forecasting and anomaly API`,
    preview: {
      eyebrow: "HOW THE APP FITS TOGETHER",
      title: "One platform, four role-based workflows",
      note: "Architecture overview based on the repository README. This is a project map, not a live app preview.",
      steps: [
        { label: "Choose a role", detail: "Customers, pharmacies, distributors, and admins use dedicated app areas." },
        { label: "Complete a workflow", detail: "Track health, manage stock, place orders, or review products and users." },
        { label: "Read and write data", detail: "The Expo app uses Supabase Auth and PostgreSQL; database policies protect access." },
        { label: "Get operational signals", detail: "Pharmacy and admin flows can call the configured ML API for forecasts and anomaly checks." }
      ],
      capabilities: ["Health tracking & education", "Pharmacy inventory", "Distributor orders", "Admin oversight", "ML-assisted operations"]
    },
    stats: [
      { label: "Workflows", value: "4 App Roles" },
      { label: "Data", value: "Supabase + PostgreSQL" },
      { label: "Operations", value: "Forecast + Anomaly API" }
    ],
    overview: "Swasthya is a multi-role healthcare and pharmacy operations app built with Expo Router, TypeScript, and Supabase. It brings customer health tools together with pharmacy inventory and orders, distributor stock workflows, and admin oversight. The repository documents a deterministic health assistant and external ML API integrations for pharmacy and admin operations.",
    readmeSections: [
      {
        title: "Application architecture",
        bullets: ["Expo Router provides separate consumer, pharmacy, distributor, and admin screens.", "The app connects to Supabase Auth, PostgreSQL, and storage; role checks are handled in the app and database policies.", "Health guidance uses deterministic rules. Forecasting and anomaly checks use a configured external ML API."]
      },
      {
        title: "Core workflows",
        bullets: ["Manage pharmacy inventory, product listings, and distributor orders.", "Support role-specific supply-chain actions with database-backed access policies.", "Use demand forecasting and anomaly-detection services to inform operations.", "Keep pharmacy, distributor, customer, and administrator workflows within the same role-aware platform."]
      },
      {
        title: "Data flow and constraints",
        bullets: ["A typical operation starts in a role-specific screen and reads or writes Supabase tables under the configured access policies.", "Pharmacy and admin screens can call the external ML API through the app's ML integration service.", "The app requires configured Supabase and ML service credentials; follow the repository setup guide and keep secrets out of source control."]
      },
      {
        title: "Implementation notes",
        bullets: ["The repository README documents the architecture, database entities, key modules, stack, setup, and known constraints.", "Configuration requires project-specific service credentials; no secrets are included in the portfolio.", "See the repository for the complete schema, policies, scripts, and setup instructions."]
      }
    ],
    keyModules: [
      { name: "Role-Based Access", desc: "Isolated interfaces for admin, distributor, pharmacy, and customer workflows." },
      { name: "ML Integration", desc: "Connects pharmacy and admin workflows to external forecasting and anomaly-check endpoints." }
    ]
  },
  {
    id: "astronomical-image-processing",
    title: "Astronomical Denoising & Detection",
    subtitle: "Deep Learning Research (2024 – 2025)",
    tagline: "Two-stage deep learning pipeline combining convolutional autoencoders with object detection for faint astronomical targets.",
    githubUrl: "https://github.com/adriennie/Astronomical-Image-Processing",
    tags: ["TensorFlow / Keras", "OpenCV", "Python", "Autoencoder", "YOLO"],
    artifacts: {
      type: "Open Science Artifacts",
      items: [
        "LaTeX Manuscript & Overleaf Source",
        "DeepSpace YOLO Dataset Configurations",
        "Evaluation Metrics CSVs (PSNR, SSIM, IoU)"
      ]
    },
    bottlenecks: [
      {
        challenge: "Loss of High-Frequency Details in Denoising",
        solution: "Standard autoencoders trained solely with Mean Squared Error (MSE) tended to over-smooth faint astronomical celestial objects, destroying high-frequency edge details required for object detection. Resolved this by balancing reconstruction loss with structural similarity constraints."
      },
      {
        challenge: "Error Propagation Between Pipeline Stages",
        solution: "Initial end-to-end training caused noise artifacts from Stage 1 to degrade YOLO bounding box regression in Stage 2. The reported mean IoU changed from 0.51 to 0.69 after denoising, but was measured against placeholder labels and is not validated detection accuracy."
      }
    ],
    evaluationNotes: "The reported mean IoU improvement from 0.51 to 0.69 was measured against placeholder labels. It should be treated as a preliminary experiment, not validated detection accuracy. The paper and public repository are provided for review.",
    readmeSections: [
      {
        title: "Results",
        intro: "The study evaluates denoising with PSNR and SSIM, then compares detector output on noisy and denoised images. Detection labels were placeholders, so IoU is a relative comparison within this setup, not validated object-detection accuracy.",
        table: {
          headers: ["Metric", "Noisy input", "Denoised input", "Notes"],
          rows: [["PSNR", "—", "27.52 dB", "Test-set average"], ["SSIM", "—", "0.88", "Test-set average"], ["Mean IoU", "0.51", "0.69", "Placeholder labels"]]
        }
      },
      {
        title: "Method",
        bullets: ["Images from the DeepSpaceYOLO dataset were resized to 128 × 128 and augmented with synthetic Gaussian noise (σ = 0.2).", "A convolutional autoencoder was trained to denoise images; a small YOLO-style grid detector was evaluated on noisy and denoised inputs.", "The reported comparison uses the same placeholder labels in both conditions; the labels do not support claims about real astronomical detection accuracy."]
      },
      {
        title: "Limitations and future work",
        bullets: ["Replace placeholder detector labels with verified annotations and report precision and recall.", "Test on real telescope observations and evaluate across multiple random seeds and noise levels.", "Train the denoiser and detector jointly and compare with stronger baselines under identical conditions."]
      },
      {
        title: "Reproducing the study",
        bullets: ["Use the public notebook and dataset configuration linked from the repository.", "The repository README describes the Python and TensorFlow environment and notebook workflow; results may vary with library versions and hardware.", "The manuscript PDF is available above, alongside the source repository."]
      }
    ],
    architecture: `Two-Stage Neural Network Pipeline:
├── Stage 1: Convolutional Autoencoder (Conv2D/Conv2DTranspose with 3x3 kernels & ReLU)
└── Stage 2: Small YOLO-style Object Detector (16x16 grid CNN predicting bounding coordinates)`,
    stats: [
      { label: "PSNR Score", value: "27.52 dB" },
      { label: "SSIM Score", value: "0.88" },
      { label: "Mean IoU (placeholder labels)", value: "0.51 → 0.69" }
    ],
    overview: "Trained a convolutional autoencoder from scratch on DeepSpace YOLO images (128x128, synthetic Gaussian noise, $\sigma=0.2$) and a YOLO-inspired 16x16-grid detector. The study reports test-set PSNR of 27.52 dB and SSIM of 0.88. Its mean IoU changed from 0.51 to 0.69 on denoised inputs, measured against placeholder labels.",
    keyModules: [
      { name: "Denoising Autoencoder", desc: "Encoder-decoder network trained with MSE loss to strip background Gaussian noise." },
      { name: "Object Detector", desc: "Grid-based CNN estimating target presence and bounding boxes." }
    ]
  }
];
