// blog.ts — tiny, self-contained content helpers.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { LedgerPost } from '~/components/almanac/Ledger.astro';

export type Post = CollectionEntry<'post'>;

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('post', ({ data }) => !data.draft);
  return posts.sort((a, b) => (b.data.publishDate?.getTime() ?? 0) - (a.data.publishDate?.getTime() ?? 0));
}

/** The post's URL: /blog/<slug>. */
export function postHref(post: Post): string {
  return `/blog/${post.id}`;
}

const MONTH_YEAR = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });
// day-month-year, e.g. "12 Dec 2025" — suits the almanac's ledger
const DAY_MONTH_YEAR = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

/** Map a post to the ledger row shape used by <Ledger>. `withDay` includes the day. */
export function toLedger(post: Post, opts: { withDay?: boolean } = {}): LedgerPost {
  const cat = post.data.category ?? post.data.tags?.[0] ?? 'Note';
  const fmt = opts.withDay ? DAY_MONTH_YEAR : MONTH_YEAR;
  return {
    date: post.data.publishDate ? fmt.format(post.data.publishDate) : '',
    cat,
    href: postHref(post),
    title: post.data.title,
    excerpt: post.data.excerpt ?? '',
    image: post.data.image,
  };
}

/** Long-form date, e.g. "12 December 2025". */
export function formatLongDate(date?: Date): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

/** URL-safe slug for a tag. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** A tag's archive URL: /blog/tag/<slug>. */
export function tagHref(tag: string): string {
  return `/blog/tag/${tagSlug(tag)}`;
}

/** Every distinct tag, with a representative display label, sorted by slug. */
export async function getAllTags(): Promise<{ tag: string; slug: string; count: number }[]> {
  const posts = await getPosts();
  const bySlug = new Map<string, { tag: string; slug: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      const slug = tagSlug(tag);
      const existing = bySlug.get(slug);
      if (existing) existing.count += 1;
      else bySlug.set(slug, { tag, slug, count: 1 });
    }
  }
  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Published posts carrying the given tag (matched by slug), newest first. */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const slug = tagSlug(tag);
  return (await getPosts()).filter((post) => (post.data.tags ?? []).some((t) => tagSlug(t) === slug));
}
