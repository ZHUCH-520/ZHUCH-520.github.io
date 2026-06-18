import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const astroConfig = readFileSync('astro.config.mjs', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const siteConfig = readFileSync('src/lib/site.ts', 'utf8');

describe('deployment configuration', () => {
  it('targets the GitHub Pages user site for ZHUCH-520', () => {
    expect(astroConfig).toContain("site: 'https://zhuch-520.github.io'");
    expect(astroConfig).not.toContain('base:');
    expect(siteConfig).toContain("url: 'https://zhuch-520.github.io'");
  });

  it('uses GitHub Actions instead of Cloudflare Pages scripts', () => {
    expect(existsSync('.github/workflows/deploy.yml')).toBe(true);
    expect(packageJson.scripts['cloudflare:login']).toBeUndefined();
    expect(packageJson.scripts['pages:create']).toBeUndefined();
    expect(packageJson.scripts.publish).toBeUndefined();
    expect(packageJson.devDependencies.wrangler).toBeUndefined();
    expect(existsSync('wrangler.jsonc')).toBe(false);
  });

  it('configures the official Astro GitHub Pages workflow', () => {
    const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');

    expect(workflow).toContain('uses: withastro/action@v6');
    expect(workflow).toContain('uses: actions/deploy-pages@v5');
    expect(workflow).toContain('branches: [main]');
    expect(workflow).toContain('pages: write');
    expect(workflow).toContain('id-token: write');
  });
});
