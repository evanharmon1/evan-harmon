import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '~/data/site';
import { getPosts, postHref } from '~/utils/blog';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${SITE.name}’s Blog`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      link: postHref(post),
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.publishDate,
    })),
    trailingSlash: false,
  });
}
