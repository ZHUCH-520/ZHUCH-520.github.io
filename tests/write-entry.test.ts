import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const astroConfig = readFileSync('astro.config.mjs', 'utf8');
const keystaticConfig = readFileSync('keystatic.config.ts', 'utf8');
const siteConfig = readFileSync('src/lib/site.ts', 'utf8');

describe('shared writing entry', () => {
  it('publishes a hidden write page that points collaborators to GitHub.dev and the repo', () => {
    expect(existsSync('src/pages/write.astro')).toBe(true);

    const writePage = readFileSync('src/pages/write.astro', 'utf8');

    expect(writePage).toContain('打开网页编辑器');
    expect(writePage).toContain('https://github.dev/ZHUCH-520/ZHUCH-520.github.io');
    expect(writePage).toContain('https://github.com/ZHUCH-520/ZHUCH-520.github.io');
    expect(writePage).toContain('src/content/posts/文章-slug/index.mdx');
    expect(siteConfig).not.toContain("href: '/write/'");
  });

  it('keeps Keystatic local-only so GitHub Pages can stay static', () => {
    expect(astroConfig).toContain(
      "const enableKeystatic = process.env.NODE_ENV === 'development' && process.env.SKIP_KEYSTATIC !== 'true';"
    );
    expect(keystaticConfig).toContain("kind: 'local'");
    expect(keystaticConfig).not.toContain("kind: 'github'");
  });
});
