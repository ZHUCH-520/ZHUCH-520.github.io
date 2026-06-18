import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getVisiblePosts } from '../lib/post-utils';
import { site } from '../lib/site';

export async function GET(context: { site?: URL }) {
  const posts = getVisiblePosts(await getCollection('posts'));

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
    })),
  });
}
