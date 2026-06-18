# Reid's Notes

一个安静的个人编辑部式博客：Astro + MDX + GitHub Pages，支持长文、游记、短札和图文混排。

## Stack

- Astro
- MDX
- Astro Content Collections
- GitHub Pages
- 宋体系统正文 + 无衬线标题

## Quick Start

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Test:

```bash
npm test
```

## Writing

See [docs/writing-guide.md](docs/writing-guide.md).

Start the local editor:

```bash
npm run dev
```

Then open `http://127.0.0.1:4321/keystatic/`.

Posts are stored under `src/content/posts/<slug>/index.mdx`.

## Deploy

GitHub Pages deploys automatically from the `main` branch with GitHub Actions.

```bash
npm run check
git push origin main
```

See [docs/deployment.md](docs/deployment.md).
