// 2026-10-12: "Sobre mí" › Formación went from a list of credentials to a
// presentation text (Figma update). Moves the document to the new shape without
// touching anything else. Run from studio/: npx sanity exec scripts/migrate-about-body.ts --with-user-token
import {getCliClient} from 'sanity/cli'
import {FALLBACK} from '../../web/src/lib/content'

const client = getCliClient({apiVersion: '2026-10-01'})
const {body, note} = FALLBACK.about.training

const doc = await client.getDocument('about')
if (!doc) throw new Error('No "about" document')
await client
  .patch('about')
  .set({'training.body': body, 'training.note': note})
  .unset(['training.items'])
  .commit()
console.log('about: presentation text set, credentials list removed')
