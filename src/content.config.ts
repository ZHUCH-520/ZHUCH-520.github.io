import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\/index\.mdx$/, '').replace(/\.mdx$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    category: z.enum(['essay', 'travel', 'notes', 'projects']),
    cover: z.string().optional(),
    location: z.string().optional(),
    series: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts };
