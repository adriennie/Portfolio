# Adrika Pradhan — AI Portfolio

Personal portfolio for my work in artificial intelligence, machine learning, and practical AI systems. I’m an M.Sc. Artificial Intelligence student at Università della Svizzera italiana (USI) in Lugano, Switzerland.

**Live site:** [adriennie.github.io/Portfolio](https://adriennie.github.io/Portfolio/)

## What’s here

- Selected projects in LLM inference, LoRA adapters, scientific image processing, and applied ML.
- Project pages with implementation details, results, limitations, and research artifacts where available.
- A research console, skills and education sections, and contact links.
- English and concise German language options.
- Responsive layout, keyboard-accessible command palette (`⌘K` / `Ctrl+K`), and reduced-motion support.
- Downloadable résumé.

## Tech stack

- [Astro](https://astro.build/) for static site generation
- [React](https://react.dev/) for interactive components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for UI animation
- GitHub Pages and GitHub Actions for hosting and deployment

## Run locally

Requires Node.js 22.12 or newer.

```sh
cd my-portfolio
npm ci
npm run dev
```

The development server runs at `http://localhost:4321`.

Build and preview the production site locally:

```sh
npm run build
npm run preview
```

## Deploy

The workflow at `.github/workflows/deploy.yml` builds the Astro app from `my-portfolio/` and deploys `my-portfolio/dist/` to GitHub Pages when code is pushed to `main`. It can also be started manually from the repository’s **Actions** tab.

GitHub Pages must use **GitHub Actions** as its publishing source under **Settings → Pages**. The Astro configuration targets the project site path `/Portfolio/`.

> The repository can be private while its GitHub Pages site is public. Don’t include secrets or private information in the site or its build output.

## Repository layout

```text
.
├── .github/workflows/deploy.yml   # Build and deploy workflow
└── my-portfolio/
    ├── public/                    # Résumé, paper, favicon
    ├── src/
    │   ├── assets/                # Profile images and bundled assets
    │   ├── components/            # Portfolio UI and interactive components
    │   ├── data/                  # Project and timeline content
    │   ├── pages/                 # Home and project detail routes
    │   └── styles/                # Global styles
    ├── astro.config.mjs
    └── package.json
```
