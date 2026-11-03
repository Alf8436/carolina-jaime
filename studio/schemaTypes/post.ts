import {defineArrayMember, defineField, defineType} from 'sanity'
import {requiredImage} from './objects'

// A blog article. The body supports the blocks of the Figma article layout: lead
// paragraph, headings, bullet lists, highlighted quote and images with captions.
export const post = defineType({
  name: 'post',
  title: 'Artículo',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Título', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Dirección',
      type: 'slug',
      options: {source: 'title'},
      description: 'Se genera desde el título: carolinajaime.com/blog/…',
      validation: (r) => r.required(),
    }),
    defineField({name: 'date', title: 'Fecha', type: 'date', initialValue: () => new Date().toISOString().slice(0, 10), validation: (r) => r.required()}),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumen',
      type: 'text',
      rows: 3,
      description: 'Se muestra en las tarjetas del blog y en Google.',
      validation: (r) => r.required().max(240),
    }),
    requiredImage('image', 'Imagen principal'),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Párrafo destacado', value: 'lead'},
            {title: 'Subtítulo', value: 'h2'},
            {title: 'Subtítulo pequeño', value: 'h3'},
          ],
          lists: [{title: 'Viñetas', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Negrita', value: 'strong'},
              {title: 'Cursiva', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [defineField({name: 'href', title: 'Dirección', type: 'url', validation: (r) => r.uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true})})],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          title: 'Imagen',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Descripción de la imagen', type: 'string'}),
            defineField({name: 'caption', title: 'Pie de foto', type: 'string'}),
          ],
        }),
        defineArrayMember({
          type: 'object',
          name: 'quote',
          title: 'Cita destacada',
          fields: [
            defineField({name: 'text', title: 'Frase', type: 'text', rows: 3}),
            defineField({name: 'author', title: 'Autor', type: 'string'}),
          ],
          preview: {select: {title: 'text', subtitle: 'author'}},
        }),
      ],
    }),
  ],
  orderings: [{title: 'Más recientes', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'date', media: 'image'}},
})
