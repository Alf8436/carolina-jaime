// 2026-10-13 (later): Figma update — Doctoralia and WhatsApp became buttons everywhere,
// the home booking card got its own title, and the credentials left the home hero.
// Run from studio/: npx sanity exec scripts/migrate-figma-2026-10-13b.ts --with-user-token
import {getCliClient} from 'sanity/cli'
import {FALLBACK} from '../../web/src/lib/content'

const client = getCliClient({apiVersion: '2026-10-01'})

await client.patch('settings').setIfMissing({whatsappLabel: FALLBACK.site.whatsappLabel}).commit()
console.log('settings: WhatsApp button text ok')

await client
  .patch('home')
  .setIfMissing({'hero.bookTitle': FALLBACK.home.hero.bookTitle})
  .unset(['hero.credentials'])
  .commit()
console.log('home: booking card title ok, credentials removed')
