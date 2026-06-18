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
  it('keeps the original homepage title with the new serif line and Whole Earth cover image', async () => {
    const homepage = await readFile('src/pages/index.astro', 'utf8');

    expect(homepage).toContain('<h1 class="display-title">在生活和技术之间，慢慢写。</h1>');
    expect(homepage).toContain('<p class="home-cover__line article-serif">不放弃思考，不交出自己。</p>');
    expect(homepage).toContain('不放弃思考，不交出自己。');
    expect(homepage).toContain('/images/whole-earth-stay-hungry.jpg');
    expect(homepage).toContain('grid-template-columns: minmax(0, 1fr) minmax(220px, 340px);');
    expect(homepage).toContain('font-size: 21px;');
    expect(homepage).toContain('border-left: 1px solid var(--line);');
    expect(homepage).toContain('margin-top: 72px;');
    expect(homepage).not.toContain('PostCard');
    expect(homepage).not.toContain('getVisiblePosts');
    expect(homepage).not.toContain('Latest');
    expect(homepage).not.toContain('Selected');
    expect(existsSync('public/images/whole-earth-stay-hungry.jpg')).toBe(true);
    expect(statSync('public/images/whole-earth-stay-hungry.jpg').size).toBeGreaterThan(50_000);
  });

  it('removes all existing MDX posts while keeping the post directory ready for new writing', () => {
    expect(existsSync('src/content/posts')).toBe(true);
    expect(findPostEntries('src/content/posts')).toEqual([]);
  });
});
