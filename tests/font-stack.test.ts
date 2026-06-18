import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('public font stack', () => {
  it('serves and references KingHwa OldSong as the primary article serif', async () => {
    const css = await readFile('src/styles/global.css', 'utf8');

    expect(existsSync('public/fonts/KingHwa_OldSong.woff')).toBe(true);
    expect(statSync('public/fonts/KingHwa_OldSong.woff').size).toBeGreaterThan(1_000_000);
    expect(css).toContain('font-family: "KingHwa OldSong"');
    expect(css).toContain('url("/fonts/KingHwa_OldSong.woff")');
    expect(css).toContain('"KingHwa OldSong", "Source Han Serif SC"');
  });
});
