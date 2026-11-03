import { toHTML, escapeHTML, type PortableTextComponents } from '@portabletext/to-html';
import { FALLBACK, POST_SUMMARY, type Category, type Pic, type PostSummary } from './content';
import { fetchSanity, sanity, sized } from './sanity';
import leafGold from '../assets/svg/hoja-dorada.svg';

export interface Post extends PostSummary {
  body: unknown[];        // Portable Text
  related: PostSummary[];
}

const POST_QUERY = /* groq */ `*[_type == "post" && slug.current == $slug][0]{
  ...${POST_SUMMARY},
  body[]{ ..., _type == "image" => { ..., "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height } },
  "related": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(date desc)[0...3]${POST_SUMMARY}
}`;

const LIST_QUERY = /* groq */ `{
  "posts": *[_type == "post" && defined(slug.current) && ($category == "" || $category in categories[]->slug.current)] | order(date desc)${POST_SUMMARY},
  "categories": *[_type == "category" && count(*[_type == "post" && references(^._id)]) > 0] | order(title asc){ title, "slug": slug.current }
}`;

// ---------- Fallback: the one article on the current site (still placeholder copy) ----------
const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dictum facilisis metus massa nisl ac est. Amet, eget lobortis fames sit adipiscing elementum, nunc neque. Mauris, lectus suspendisse posuere interdum vestibulum massa. Lobortis adipiscing sit amet sed vulputate pulvinar eu.';
const block = (text: string, style = 'normal', extra: Record<string, unknown> = {}) => ({
  _type: 'block', _key: Math.random().toString(36).slice(2), style, markDefs: [],
  children: [{ _type: 'span', _key: 's', text, marks: [] }], ...extra
});
const FALLBACK_POST: Post = {
  ...FALLBACK.posts[0],
  body: [
    block('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dictum facilisis metus massa nisl ac est. Amet, eget lobortis fames sit adipiscing elementum, nunc neque.', 'lead'),
    block(LOREM),
    block('Lorem ipsum dolor sit amet', 'h2'),
    block(LOREM),
    block('Dictum facilisis metus massa nisl ac est.', 'normal', { listItem: 'bullet', level: 1 }),
    block('Amet, eget lobortis fames sit adipiscing elementum.', 'normal', { listItem: 'bullet', level: 1 }),
    block('Mauris, lectus suspendisse posuere interdum vestibulum massa.', 'normal', { listItem: 'bullet', level: 1 }),
    { _type: 'quote', _key: 'q', text: '"Cada niño nos enseña a conectar con nuestra propia sensibilidad, contágiate de ellos"', author: 'M.Sc. Carolina Jaime García' },
    { _type: 'image', _key: 'i', src: '/img/blog-placeholder.jpg', width: 683, height: 450, alt: '', caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    block('Lorem ipsum dolor sit amet', 'h3'),
    block(LOREM)
  ],
  related: []
};

export async function getPost(slug: string): Promise<Post | null> {
  if (!sanity) return slug === FALLBACK_POST.slug ? FALLBACK_POST : null;
  const post = await fetchSanity<Post>(POST_QUERY, { slug });
  if (!post) return null;
  post.related ??= [];
  // Top up with the latest articles when there aren't enough in the same category
  if (post.related.length < 3) {
    const latest = await fetchSanity<PostSummary[]>(`*[_type == "post" && defined(slug.current) && slug.current != $slug] | order(date desc)[0...3]${POST_SUMMARY}`, { slug });
    for (const p of latest ?? []) if (post.related.length < 3 && !post.related.some((r) => r.slug === p.slug)) post.related.push(p);
  }
  return post;
}

export async function getPosts(category = ''): Promise<{ posts: PostSummary[]; categories: Category[] }> {
  if (!sanity) {
    const posts = FALLBACK.posts.filter((p) => !category || p.categories.some((c) => c.slug === category));
    return { posts, categories: FALLBACK.posts[0].categories };
  }
  return (await fetchSanity(LIST_QUERY, { category })) ?? { posts: [], categories: [] };
}

// ---------- Portable Text → HTML, styled after the Figma "Artículo (Portable Text)" ----------
type ImageBlock = Pic & { caption?: string };
const components: PortableTextComponents = {
  block: {
    lead: ({ children }) => `<p class="pt-lead">${children}</p>`,
    h2: ({ children }) => `<h2 class="pt-h2">${children}</h2>`,
    h3: ({ children }) => `<h3 class="pt-h3">${children}</h3>`,
    blockquote: ({ children }) => `<blockquote class="pt-quote"><p>${children}</p></blockquote>`
  },
  list: { bullet: ({ children }) => `<ul class="pt-list">${children}</ul>` },
  listItem: { bullet: ({ children }) => `<li><img src="${leafGold.src}" width="22" height="17" alt="">${children}</li>` },
  marks: {
    link: ({ children, value }) => {
      const href = String(value?.href ?? '');
      const external = /^https?:/.test(href);
      return `<a href="${escapeHTML(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${children}</a>`;
    }
  },
  types: {
    image: ({ value }: { value: ImageBlock }) => {
      if (!value?.src) return '';
      const h = Math.round((760 * value.height) / value.width);
      return `<figure class="pt-figure"><img src="${escapeHTML(sized(value.src, 760))}" srcset="${escapeHTML(sized(value.src, 760))} 1x, ${escapeHTML(sized(value.src, 1520))} 2x" width="760" height="${h}" alt="${escapeHTML(value.alt ?? '')}" loading="lazy" decoding="async">${value.caption ? `<figcaption>${escapeHTML(value.caption)}</figcaption>` : ''}</figure>`;
    },
    quote: ({ value }: { value: { text?: string; author?: string } }) =>
      `<blockquote class="pt-quote"><p>${escapeHTML(value.text ?? '')}</p>${value.author ? `<cite>– ${escapeHTML(value.author)}</cite>` : ''}</blockquote>`
  }
};

export const renderBody = (body: unknown[]) => toHTML(body as Parameters<typeof toHTML>[0], { components });
