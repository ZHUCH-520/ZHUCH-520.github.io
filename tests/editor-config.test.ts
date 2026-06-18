import { describe, expect, it } from 'vitest';

import {
  editablePostCollectionPath,
  editorImageConfig,
  postCategoryOptions,
} from '../src/lib/editor-config';

describe('editor configuration', () => {
  it('keeps the editor category options aligned with the public blog categories', () => {
    expect(postCategoryOptions.map((option) => option.value).sort()).toEqual([
      'essay',
      'notes',
      'projects',
      'travel',
    ]);
  });

  it('writes editable posts into the existing folder-based post structure', () => {
    expect(editablePostCollectionPath).toBe('src/content/posts/*/');
  });

  it('stores uploaded writing images under a public media path', () => {
    expect(editorImageConfig).toEqual({
      directory: 'public/media/posts',
      publicPath: '/media/posts/',
    });
  });
});
