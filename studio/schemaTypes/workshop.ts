import {defineField, defineType} from 'sanity'
import {orderRankField} from './order'
import {requiredImage} from './objects'

export const workshop = defineType({
  name: 'workshop',
  title: 'Taller',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Título', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'text', title: 'Descripción', type: 'text', rows: 4}),
    requiredImage('image', 'Foto'),
    defineField({
      name: 'message',
      title: 'Mensaje de WhatsApp',
      type: 'string',
      description: 'El texto con el que se abre WhatsApp al tocar "Whatsapp" en la tarjeta.',
    }),
    orderRankField,
  ],
  orderings: [{title: 'Orden', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', media: 'image'}},
})
