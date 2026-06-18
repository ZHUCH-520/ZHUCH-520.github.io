import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const astroConfig = readFileSync('astro.config.mjs', 'utf8');
const keystaticConfig = readFileSync('keystatic.config.ts', 'utf8');
const siteConfig = readFileSync('src/lib/site.ts', 'utf8');

describe('shared writing entry', () => {
  it('publishes a hidden mobile writing page that points collaborators to the issue form', () => {
    expect(existsSync('src/pages/write.astro')).toBe(true);

    const writePage = readFileSync('src/pages/write.astro', 'utf8');

    expect(writePage).toContain('用手机写新文章');
    expect(writePage).toContain('https://github.com/ZHUCH-520/ZHUCH-520.github.io/issues/new?template=blog-post.yml');
    expect(writePage).toContain('https://github.com/ZHUCH-520/ZHUCH-520.github.io');
    expect(writePage).toContain('只有仓库 owner、member 或 collaborator 的投稿会被发布');
    expect(writePage).not.toContain('github.dev');
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
