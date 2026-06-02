// images.ts — resolve a post's frontmatter `image` string to a usable source.
// Local assets (`~/assets/images/…`) become optimizable ImageMetadata; remote
// URLs (`https://…`) are passed through for a plain <img>.
import type { ImageMetadata } from 'astro';

const local = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{jpeg,jpg,JPG,png,gif,webp,avif}', {
  eager: true,
});

/** Resolve a `~/assets/images/…` path to its imported ImageMetadata, if present. */
export function getLocalImage(path?: string): ImageMetadata | undefined {
  if (!path) return undefined;
  const key = path.replace(/^~\//, '/src/');
  return local[key]?.default;
}

/** True if the path is an absolute http(s) URL. */
export function isRemoteImage(path?: string): boolean {
  return !!path && /^https?:\/\//.test(path);
}
