import {defineArrayMember, defineField, defineType} from 'sanity'
import {EMPHASIS, HERO_TITLE, eyebrowField, requiredImage} from './objects'

export const about = defineType({
  name: 'about',
  title: 'Sobre mí',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Portada',
      type: 'object',
      fields: [
        eyebrowField(),
        defineField({name: 'title', title: 'Título', type: 'string', description: HERO_TITLE}),
        defineField({name: 'text', title: 'Cargo', type: 'string', description: 'Escribe _entre guiones bajos_ lo que va en negrita. Ej.: _M.Sc._ Psicóloga y Psicoterapeuta'}),
        requiredImage('image', 'Foto'),
      ],
    }),
    defineField({
      name: 'training',
      title: 'Formación',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Título', type: 'string', description: EMPHASIS}),
        requiredImage('image', 'Foto (se recorta en arco)'),
        defineField({
          name: 'body',
          title: 'Presentación',
          type: 'text',
          rows: 14,
          description: 'Deja una línea en blanco entre párrafos. Escribe _entre guiones bajos_ lo que va en negrita. En celulares se muestra el inicio con un enlace "Leer más".',
        }),
        defineField({name: 'note', title: 'Texto destacado', type: 'text', rows: 4}),
      ],
    }),
    defineField({
      name: 'experience',
      title: 'Experiencia laboral',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Título', type: 'string', description: EMPHASIS}),
        defineField({name: 'intro', title: 'Introducción', type: 'text', rows: 4}),
        defineField({name: 'items', title: 'Lo que brindo', type: 'array', of: [defineArrayMember({type: 'string'})]}),
        defineField({name: 'outro', title: 'Texto final', type: 'text', rows: 3}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Sobre mí'})},
})
