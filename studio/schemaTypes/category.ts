import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Nombre', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Identificador en la dirección', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
  ],
})
