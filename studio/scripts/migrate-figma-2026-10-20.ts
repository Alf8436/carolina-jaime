// 2026-10-20: Figma home update — the newsletter block leaves the home and a
// "Testimonios" carousel takes its place. Fills the section's label and title only
// where empty (Studio edits are kept). Testimonials themselves are real content:
// none are created here.
// Run from studio/: npx sanity exec scripts/migrate-figma-2026-10-20.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-01'})

for (const id of await client.fetch<string[]>(`*[_id in ["home", "drafts.home"]]._id`)) {
  await client
    .patch(id)
    .setIfMissing({testimonials: {}})
    .setIfMissing({'testimonials.eyebrow': 'Testimonios', 'testimonials.title': 'Lo que dicen *las familias*'})
    .commit()
  console.log(`${id}: testimonials ok`)
}
