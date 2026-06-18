import { describe, expect, it } from 'vitest';
import {
  getCategoryPosts,
  getRelatedPosts,
  getTagCounts,
  getVisiblePosts,
  sortPostsByDateDesc,
  type BlogPost,
} from '../src/lib/post-utils';

const posts: BlogPost[] = [
  {
    slug: 'kamakura-day',
    data: {
      title: '镰仓的一天',
      date: new Date('2026-06-18'),
      description: '海风和街道。',
      tags: ['游记', '日本'],
      category: 'travel',
      draft: false,
    },
  },
  {
    slug: 'reading-note',
    data: {
      title: '读到一半停下来',
      date: new Date('2026-06-12'),
      description: '关于注意力。',
      tags: ['阅读', 'AI'],
      category: 'notes',
      draft: false,
    },
  },
  {
    slug: 'draft-post',
    data: {
      title: '草稿',
      date: new Date('2026-06-20'),
      description: '不应该出现在生产列表。',
      tags: ['游记'],
      category: 'travel',
      draft: true,
    },
  },
  {
    slug: 'older-travel',
    data: {
      title: '旧游记',
      date: new Date('2025-11-01'),
      description: '旧文章。',
      tags: ['游记'],
      category: 'travel',
      draft: false,
    },
  },
];

describe('post utilities', () => {
  it('sorts posts by date descending', () => {
    expect(sortPostsByDateDesc([...posts]).map((post) => post.slug)).toEqual([
      'draft-post',
      'kamakura-day',
      'reading-note',
      'older-travel',
    ]);
  });

  it('filters draft posts from public lists', () => {
    expect(getVisiblePosts(posts).map((post) => post.slug)).toEqual([
      'kamakura-day',
      'reading-note',
      'older-travel',
    ]);
  });

  it('returns visible posts by category in date order', () => {
    expect(getCategoryPosts(posts, 'travel').map((post) => post.slug)).toEqual([
      'kamakura-day',
      'older-travel',
    ]);
  });

  it('counts tags from visible posts only', () => {
    expect(getTagCounts(posts)).toEqual([
      ['游记', 2],
      ['AI', 1],
      ['日本', 1],
      ['阅读', 1],
    ]);
  });

  it('returns related posts sharing tags and excludes the current post', () => {
    expect(getRelatedPosts(posts, posts[0], 3).map((post) => post.slug)).toEqual([
      'older-travel',
    ]);
  });
});
