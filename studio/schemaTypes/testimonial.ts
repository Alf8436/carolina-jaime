import {defineField, defineType} from 'sanity'
import {orderRankField} from './order'

// Figma "Tarjeta testimonio": the quote, who said it and how they know Carolina.
// Shown in the home "Testimonios" carousel; with none published the section is hidden.
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  description: 'Publica solo testimonios reales y con el consentimiento escrito de quien los da.',
  fields: [
    defineField({name: 'quote', title: 'Testimonio', type: 'text', rows: 5, validation: (r) => r.required()}),
    defineField({name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'relation',
      title: 'Relación',
      type: 'string',
      description: 'Ej.: Mamá de paciente · Docente · Taller grupal · Paciente adulta.',
    }),
    defineField({
      name: 'photo',
      title: 'Foto (opcional)',
      type: 'image',
      options: {hotspot: true},
      description: 'Si no hay foto, se muestran las iniciales del nombre.',
    }),
    defineField({
      name: 'color',
      title: 'Color de la tarjeta',
      type: 'string',
      options: {
        list: [
          {title: 'Automático', value: 'auto'},
          {title: 'Blanco', value: 'white'},
          {title: 'Morado', value: 'purple'},
          {title: 'Rosa', value: 'rose'},
          {title: 'Dorado', value: 'gold'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'auto',
      description: 'Automático alterna los colores como en el diseño.',
    }),
    orderRankField,
  ],
  orderings: [{title: 'Orden', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'relation', media: 'photo'}},
})
