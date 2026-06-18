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
  it('uses the new homepage line and Whole Earth cover image without article lists', async () => {
    const homepage = await readFile('src/pages/index.astro', 'utf8');

    expect(homepage).toContain('不放弃思考，不交出自己。');
    expect(homepage).toContain('/images/whole-earth-stay-hungry.jpg');
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
