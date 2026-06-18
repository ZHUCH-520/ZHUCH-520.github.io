import type { BlogCategory } from './post-utils';

export const postCategoryOptions = [
  { label: '随笔', value: 'essay' },
  { label: '游记', value: 'travel' },
  { label: '短札', value: 'notes' },
  { label: '项目', value: 'projects' },
] as const satisfies ReadonlyArray<{ label: string; value: BlogCategory }>;

export const editablePostCollectionPath = 'src/content/posts/*/';

export const editorImageConfig = {
  directory: 'public/media/posts',
  publicPath: '/media/posts/',
} as const;
