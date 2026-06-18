import { existsSync, readdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function findPostEntries(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      return findPostEntries(path);
    }

    return path.endsWith('.mdx') ? [path] : [];
  });
}

describe('minimal homepage reset', () => {
  it('keeps the original homepage title with the motto and Earthrise magazine-cover composition', async () => {
    const homepage = await readFile('src/pages/index.astro', 'utf8');

    expect(homepage).toContain('<h1 class="display-title">在生活和技术之间，慢慢写。</h1>');
    expect(homepage).toContain('<p class="home-cover__line article-serif">不放弃思考，不交出自己。</p>');
    expect(homepage).toContain('不放弃思考，不交出自己。');
    expect(homepage).toContain('/images/earthrise-apollo8.jpg');
    expect(homepage).toContain('position: absolute;');
    expect(homepage).toContain('width: 54%;');
    expect(homepage).toContain('background: linear-gradient(90deg, rgba(247, 243, 234, 0.94), rgba(247, 243, 234, 0.18) 54%, rgba(247, 243, 234, 0));');
    expect(homepage).toContain('font-size: 21px;');
    expect(homepage).toContain('border-top: 1px solid var(--line);');
    expect(homepage).not.toContain('PostCard');
    expect(homepage).not.toContain('getVisiblePosts');
    expect(homepage).not.toContain('Latest');
    expect(homepage).not.toContain('Selected');
    expect(existsSync('public/images/earthrise-apollo8.jpg')).toBe(true);
    expect(statSync('public/images/earthrise-apollo8.jpg').size).toBeGreaterThan(100_000);
  });

  it('removes all existing MDX posts while keeping the post directory ready for new writing', () => {
    expect(existsSync('src/content/posts')).toBe(true);
    expect(findPostEntries('src/content/posts')).toEqual([]);
  });
});
