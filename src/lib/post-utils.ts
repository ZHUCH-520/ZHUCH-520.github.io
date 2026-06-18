export type BlogCategory = 'essay' | 'travel' | 'notes' | 'projects';

export interface BlogPost {
  id?: string;
  slug?: string;
  data: {
    title: string;
    date: Date;
    description: string;
    tags: string[];
    category: BlogCategory;
    draft: boolean;
    cover?: string;
    location?: string;
    series?: string;
    updated?: Date;
  };
}

export function getPostSlug(post: BlogPost): string {
  return post.slug ?? post.id ?? '';
}

export function sortPostsByDateDesc(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getVisiblePosts(posts: BlogPost[]): BlogPost[] {
  return sortPostsByDateDesc(posts.filter((post) => !post.data.draft));
}

export function getCategoryPosts(posts: BlogPost[], category: BlogCategory): BlogPost[] {
  return getVisiblePosts(posts).filter((post) => post.data.category === category);
}

export function getTagCounts(posts: BlogPost[]): [string, number][] {
  const counts = new Map<string, number>();

  for (const post of getVisiblePosts(posts)) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function getRelatedPosts(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit = 3,
): BlogPost[] {
  const currentTags = new Set(currentPost.data.tags);

  return getVisiblePosts(posts)
    .filter((post) => getPostSlug(post) !== getPostSlug(currentPost))
    .map((post) => ({
      post,
      score: post.data.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.date.getTime() - a.post.data.date.getTime())
    .slice(0, limit)
    .map(({ post }) => post);
}

export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
