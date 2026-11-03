// 2026-10-13: Figma update — labels with a leaf over the section titles, new page
// hero titles with a line under them, credentials over the home headline, and the
// guiding line on Servicios. Fills the new fields and swaps the old copy for the new
// one, but only where a field still holds the old text, so Studio edits survive.
// Run from studio/: npx sanity exec scripts/migrate-figma-2026-10-13.ts --with-user-token
import {getCliClient} from 'sanity/cli'
import {FALLBACK} from '../../web/src/lib/content'

const client = getCliClient({apiVersion: '2026-10-01'})
const {home, about, pages} = FALLBACK

type Doc = Record<string, unknown>
const get = (doc: Doc, path: string) => path.split('.').reduce<unknown>((v, k) => (v as Doc | undefined)?.[k], doc)

// path → [old copy it replaces (undefined: only when empty), new copy]
async function migrate(id: string, changes: Record<string, [string | undefined, string]>, unset: string[] = []) {
  const doc = await client.getDocument(id)
  if (!doc) throw new Error(`No "${id}" document`)
  const set: Record<string, string> = {}
  for (const [path, [old, value]] of Object.entries(changes)) {
    const current = get(doc, path)
    if (current === undefined || current === null || current === '' || current === old) set[path] = value
    else console.log(`  ${id}.${path}: kept (edited in Studio)`)
  }
  await client.patch(id).set(set).unset(unset).commit()
  console.log(`${id}: ${Object.keys(set).length} fields updated${unset.length ? `, ${unset.length} removed` : ''}`)
}

await migrate('home', {
  'hero.credentials': [undefined, 'Psicóloga colegiada\n_Máster por la VIU_ (España)'], // removed again later the same day
  'hero.servicesTitle': ['Servicios', home.hero.servicesTitle],
  'ways.text': [undefined, home.ways.text],
  'blog.eyebrow': [undefined, home.blog.eyebrow],
  'blog.text': ['Entérate de lo último en mi blog', home.blog.text],
  'contact.eyebrow': [undefined, home.contact.eyebrow],
  'contact.title': ['Contáctame', home.contact.title],
  'contact.text': ['Envíame un mensaje o contáctame ahora.', home.contact.text],
})

// The hero's name and role became the title and one line under it
await migrate(
  'about',
  {
    'hero.eyebrow': [undefined, about.hero.eyebrow],
    'hero.title': ['Sobre mí', about.hero.title],
    'hero.text': [undefined, about.hero.text!],
  },
  ['hero.name', 'hero.role'],
)

await migrate('pages', {
  'services.eyebrow': [undefined, pages.services.eyebrow],
  'services.title': ['Servicios', pages.services.title],
  'services.text': [undefined, pages.services.text!],
  'services.lead': [undefined, pages.services.lead],
  'services.hintTouch': [undefined, pages.services.hintTouch],
  'workshops.eyebrow': [undefined, pages.workshops.eyebrow],
  'workshops.title': ['Talleres', pages.workshops.title],
  'workshops.text': [undefined, pages.workshops.text!],
  'blog.eyebrow': [undefined, pages.blog.eyebrow],
  'blog.title': ['Blog', pages.blog.title],
  'blog.text': ['Entérate de lo último en mi blog', pages.blog.text!],
  'contact.eyebrow': [undefined, pages.contact.eyebrow],
  'contact.title': ['Contacto', pages.contact.title],
  'contact.text': ['Envíame un mensaje o contáctame ahora.', pages.contact.text!],
})
