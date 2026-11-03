import {defineConfig} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {icons} from '@sanity/icons'
import {schemaTypes, SINGLETONS} from './schemaTypes'
import {DATASET, PROJECT_ID} from './project'

const singleton = (S: StructureBuilder, id: string, title: string, icon: typeof icons.home) =>
  S.listItem().title(title).icon(icon).child(S.document().schemaType(id).documentId(id))

export default defineConfig({
  name: 'default',
  title: 'Carolina Jaime',

  projectId: PROJECT_ID,
  dataset: DATASET,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            singleton(S, 'home', 'Página de inicio', icons.home),
            singleton(S, 'about', 'Sobre mí', icons.user),
            S.documentTypeListItem('service').title('Servicios').icon(icons.heart),
            S.documentTypeListItem('workshop').title('Talleres').icon(icons.users),
            S.documentTypeListItem('testimonial').title('Testimonios').icon(icons.comment),
            S.divider(),
            S.documentTypeListItem('post').title('Blog · Artículos').icon(icons['document-text']),
            S.documentTypeListItem('category').title('Blog · Categorías').icon(icons.tag),
            S.divider(),
            singleton(S, 'pages', 'Portadas de páginas', icons.images),
            singleton(S, 'settings', 'Ajustes del sitio', icons.cog),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Singletons can't be created again from the "new document" menu
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    // ...nor duplicated or deleted
    actions: (actions, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
