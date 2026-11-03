import {defineField, defineType} from 'sanity'
import {EMPHASIS, HERO_TITLE, eyebrowField, requiredImage} from './objects'

// Hero (label, title, line and photo) of the inner pages whose content lives elsewhere
const hero = (name: string, title: string, extra: ReturnType<typeof defineField>[] = []) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      eyebrowField(),
      defineField({name: 'title', title: 'Título', type: 'string', description: HERO_TITLE}),
      defineField({name: 'text', title: 'Bajada', type: 'text', rows: 2, description: 'Una o dos frases bajo el título.'}),
      ...extra,
      requiredImage('image', 'Foto de portada'),
    ],
  })

export const pages = defineType({
  name: 'pages',
  title: 'Portadas de páginas',
  type: 'document',
  fields: [
    hero('services', 'Servicios', [
      defineField({name: 'lead', title: 'Frase guía', type: 'text', rows: 2, description: `Va sobre la lista de servicios. ${EMPHASIS}`}),
      defineField({name: 'hint', title: 'Indicación sobre el acordeón (computadora)', type: 'string'}),
      defineField({name: 'hintTouch', title: 'Indicación sobre el acordeón (celular)', type: 'string'}),
    ]),
    hero('workshops', 'Talleres'),
    hero('blog', 'Blog'),
    hero('contact', 'Contacto', [defineField({name: 'formTitle', title: 'Título junto al formulario', type: 'string'})]),
  ],
  preview: {prepare: () => ({title: 'Portadas de páginas'})},
})
