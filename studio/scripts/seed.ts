// One-off import of the site's starting content (web/src/lib/content.ts, the Figma
// copy and photos) into the dataset.
// Run from studio/: npx sanity exec scripts/seed.ts --with-user-token
// Re-running REPLACES the documents with this copy, overwriting edits made in the
// Studio — only run it again on purpose. Images are deduplicated by Sanity.
import {createReadStream} from 'node:fs'
import {basename, resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'
import {FALLBACK} from '../../web/src/lib/content'

const client = getCliClient({apiVersion: '2026-10-01'})
const PUBLIC = resolve(process.cwd(), '../web/public')

const uploads = new Map<string, Promise<string>>()
function upload(src: string) {
  if (!uploads.has(src)) {
    uploads.set(
      src,
      client.assets.upload('image', createReadStream(resolve(PUBLIC, src.replace(/^\//, ''))), {filename: basename(src)}).then((a) => {
        console.log('  image', src)
        return a._id
      }),
    )
  }
  return uploads.get(src)!
}

type Json = unknown
const isPic = (v: Json): v is {src: string; alt?: string} =>
  !!v && typeof v === 'object' && typeof (v as {src?: unknown}).src === 'string' && (v as {src: string}).src.startsWith('/img/')

// Turns fallback content into Sanity values: pictures become uploaded image
// references, objects inside arrays get _key (and _type when the schema names one).
async function toSanity(value: Json, arrayType?: string, imageType = 'imageWithAlt'): Promise<Json> {
  if (isPic(value)) {
    const ref = await upload(value.src)
    return {_type: imageType, asset: {_type: 'reference', _ref: ref}, ...(value.alt ? {alt: value.alt} : {})}
  }
  if (Array.isArray(value)) {
    return Promise.all(
      value.map(async (item, i) => {
        const v = await toSanity(item)
        return v && typeof v === 'object' && !Array.isArray(v) ? {_key: `k${i}`, ...(arrayType ? {_type: arrayType} : {}), ...v} : v
      }),
    )
  }
  if (value && typeof value === 'object') {
    const out: Record<string, Json> = {}
    for (const [k, v] of Object.entries(value)) {
      // Array member types as named in studio/schemaTypes
      const member = {posts: 'post', items: undefined}[k as 'posts' | 'items']
      out[k] = await toSanity(v, member)
    }
    return out
  }
  return value
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dictum facilisis metus massa nisl ac est. Amet, eget lobortis fames sit adipiscing elementum, nunc neque. Mauris, lectus suspendisse posuere interdum vestibulum massa. Lobortis adipiscing sit amet sed vulputate pulvinar eu.'
let k = 0
const block = (text: string, style = 'normal', extra: Record<string, unknown> = {}) => ({
  _type: 'block',
  _key: `b${k++}`,
  style,
  markDefs: [],
  children: [{_type: 'span', _key: `s${k}`, text, marks: []}],
  ...extra,
})

async function main() {
  const {site, home, about, pages, services, workshops, posts} = FALLBACK
  console.log('Uploading images…')

  const tx = client.transaction()

  const settings = (await toSanity(site)) as Record<string, Json>
  tx.createOrReplace({_id: 'settings', _type: 'settings', ...settings})

  const homeDoc = (await toSanity(home)) as {ways: {items: Record<string, Json>[]}}
  homeDoc.ways.items = homeDoc.ways.items.map((i) => ({...i, _type: 'way'}))
  tx.createOrReplace({_id: 'home', _type: 'home', ...homeDoc})

  tx.createOrReplace({_id: 'about', _type: 'about', ...((await toSanity(about)) as object)})

  tx.createOrReplace({_id: 'pages', _type: 'pages', ...((await toSanity(pages)) as object)})

  for (const [i, s] of services.entries()) {
    const {slug, ...rest} = (await toSanity(s)) as {slug: string}
    tx.createOrReplace({_id: `service-${slug}`, _type: 'service', ...rest, slug: {_type: 'slug', current: slug}, order: i + 1})
  }
  for (const [i, w] of workshops.entries()) {
    tx.createOrReplace({_id: `workshop-${i + 1}`, _type: 'workshop', ...((await toSanity(w)) as object), order: i + 1})
  }

  const categories = posts[0].categories
  for (const c of categories) {
    tx.createOrReplace({_id: `category-${c.slug}`, _type: 'category', title: c.title, slug: {_type: 'slug', current: c.slug}})
  }

  // The one article of the old site, still placeholder copy, laid out like the Figma
  const post = posts[0]
  const figure = (await toSanity({src: '/img/blog-placeholder.jpg', alt: ''}, undefined, 'image')) as object
  tx.createOrReplace({
    _id: `post-${post.slug}`,
    _type: 'post',
    title: post.title,
    slug: {_type: 'slug', current: post.slug},
    date: post.date,
    excerpt: post.excerpt,
    image: await toSanity(post.image),
    categories: categories.map((c, i) => ({_key: `c${i}`, _type: 'reference', _ref: `category-${c.slug}`})),
    body: [
      block('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dictum facilisis metus massa nisl ac est. Amet, eget lobortis fames sit adipiscing elementum, nunc neque.', 'lead'),
      block(LOREM),
      block('Lorem ipsum dolor sit amet', 'h2'),
      block(LOREM),
      block('Dictum facilisis metus massa nisl ac est.', 'normal', {listItem: 'bullet', level: 1}),
      block('Amet, eget lobortis fames sit adipiscing elementum.', 'normal', {listItem: 'bullet', level: 1}),
      block('Mauris, lectus suspendisse posuere interdum vestibulum massa.', 'normal', {listItem: 'bullet', level: 1}),
      {_type: 'quote', _key: 'quote', text: '"Cada niño nos enseña a conectar con nuestra propia sensibilidad, contágiate de ellos"', author: 'M.Sc. Carolina Jaime García'},
      {...figure, _key: 'figure', caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
      block('Lorem ipsum dolor sit amet', 'h3'),
      block(LOREM),
    ],
  })

  console.log('Writing documents…')
  const res = await tx.commit()
  console.log(`Done: ${res.results.length} documents`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
