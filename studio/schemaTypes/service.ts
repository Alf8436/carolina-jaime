import {defineField, defineType} from 'sanity'
import {orderRankField} from './order'
import {requiredImage} from './objects'

export const service = defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Nombre', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'shortTitle', title: 'Nombre corto', type: 'string', description: 'Para la lista de la portada de inicio.'}),
    defineField({
      name: 'slug',
      title: 'Identificador en la dirección',
      type: 'slug',
      options: {source: 'title'},
      description: 'Permite enlazar directo al servicio: /servicios#identificador',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Descripción',
      type: 'text',
      rows: 10,
      description: 'Deja una línea en blanco entre párrafos. *Entre asteriscos* va resaltado en morado.',
    }),
    requiredImage('image', 'Foto (se recorta en arco)'),
    requiredImage('icon', 'Miniatura (se recorta en círculo)'),
    orderRankField,
  ],
  orderings: [{title: 'Orden', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', media: 'icon'}},
})
