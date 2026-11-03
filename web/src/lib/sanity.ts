import { createClient, type SanityClient } from '@sanity/client';
import { CONTENT_QUERY, FALLBACK, withFallback, type Content } from './content';

// Public dataset, read without a token. Through the API CDN: Sanity purges it on
// every publish, so edits show up within seconds and visits don't hit the API.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) ?? 'production';

export const sanity: SanityClient | null = projectId
  ? createClient({ projectId, dataset, apiVersion: '2026-10-01', useCdn: true })
  : null;

// Sanity images are served resized from its CDN
export function sized(src: string, width: number) {
  if (!src.includes('cdn.sanity.io')) return src;
  return `${src}?w=${Math.round(width)}&auto=format&q=80`;
}

export async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!sanity) return null;
  try {
    return await sanity.fetch<T>(query, params);
  } catch (err) {
    console.error('[sanity] query failed, using fallback copy', err);
    return null;
  }
}

export async function getContent(): Promise<Content> {
  const data = await fetchSanity<Partial<Content>>(CONTENT_QUERY);
  const content = withFallback(data, FALLBACK);
  // Articles are real content, never filler: once Sanity answers, its list stands even if empty
  if (data) content.posts = data.posts ?? [];
  // Same for testimonials: only real ones, so the fallback list is empty
  content.testimonials = data?.testimonials ?? [];
  return content;
}
