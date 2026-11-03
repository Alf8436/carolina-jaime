import {defineArrayMember, defineField, defineType} from 'sanity'
import {EMPHASIS, requiredImage} from './objects'

// Contact details and blocks that repeat across pages
export const settings = defineType({
  name: 'settings',
  title: 'Ajustes del sitio',
  type: 'document',
  groups: [
    {name: 'contact', title: 'Contacto', default: true},
    {name: 'blocks', title: 'Bloques comunes'},
    {name: 'instagram', title: 'Instagram'},
    {name: 'seo', title: 'Google y redes'},
  ],
  fields: [
    defineField({name: 'phone', title: 'Teléfono (como se muestra)', type: 'string', group: 'contact', description: 'Ej.: 992 746 693'}),
    defineField({
      name: 'whatsapp',
      title: 'Número de WhatsApp',
      type: 'string',
      group: 'contact',
      description: 'Con código de país y sin espacios ni +. Ej.: 51992746693',
      validation: (r) => r.regex(/^\d{8,15}$/, {name: 'solo números'}),
    }),
    defineField({name: 'email', title: 'Correo', type: 'string', group: 'contact', validation: (r) => r.email()}),
    defineField({name: 'doctoralia', title: 'Enlace de Doctoralia', type: 'url', group: 'contact', description: 'A dónde llevan todos los botones "Agendar cita".'}),
    defineField({name: 'doctoraliaLabel', title: 'Doctoralia (como se muestra)', type: 'string', group: 'contact', description: 'Ej.: doctoralia.pe/carolina-jaime'}),
    defineField({name: 'bookingLabel', title: 'Texto del botón de citas', type: 'string', group: 'contact', initialValue: 'Agendar cita'}),
    defineField({name: 'whatsappLabel', title: 'Texto del botón de WhatsApp', type: 'string', group: 'contact', initialValue: 'WhatsApp'}),
    defineField({name: 'instagram', title: 'Enlace de Instagram', type: 'url', group: 'contact'}),
    defineField({name: 'instagramHandle', title: 'Usuario de Instagram', type: 'string', group: 'contact', description: 'Ej.: @psico.carojaime'}),
    defineField({name: 'facebook', title: 'Enlace de Facebook', type: 'url', group: 'contact'}),

    defineField({
      name: 'consulta',
      title: 'Bloque "¿Tienes una consulta?"',
      type: 'object',
      group: 'blocks',
      description: 'Aparece al final de Sobre mí, Servicios y Talleres.',
      fields: [defineField({name: 'title', title: 'Título', type: 'string'}), requiredImage('image', 'Foto')],
    }),
    defineField({
      // No longer on the site (2026-10-20, removed from Figma); hidden so the saved copy stays
      name: 'newsletter',
      title: 'Bloque del newsletter',
      type: 'object',
      group: 'blocks',
      hidden: true,
      fields: [
        defineField({name: 'title', title: 'Título', type: 'string'}),
        defineField({name: 'text', title: 'Texto', type: 'text', rows: 2}),
        requiredImage('image', 'Foto'),
      ],
    }),

    defineField({
      name: 'instagramFeed',
      title: 'Bloque de Instagram',
      type: 'object',
      group: 'instagram',
      fields: [
        defineField({name: 'title', title: 'Título', type: 'string', description: EMPHASIS}),
        defineField({
          name: 'posts',
          title: 'Publicaciones',
          type: 'array',
          description: 'Sube una captura de cada publicación y pega su enlace. Se muestran 5.',
          validation: (r) => r.max(5),
          of: [
            defineArrayMember({
              type: 'object',
              name: 'post',
              title: 'Publicación',
              fields: [requiredImage('image', 'Imagen'), defineField({name: 'url', title: 'Enlace de la publicación', type: 'url'})],
              preview: {select: {media: 'image', subtitle: 'url'}, prepare: ({media, subtitle}) => ({title: 'Publicación', subtitle, media})},
            }),
          ],
        }),
      ],
    }),

    defineField({name: 'seoTitle', title: 'Título en Google', type: 'string', group: 'seo', validation: (r) => r.max(70)}),
    defineField({name: 'seoDescription', title: 'Descripción en Google', type: 'text', rows: 3, group: 'seo', validation: (r) => r.max(170)}),
    defineField({name: 'shareImage', title: 'Imagen al compartir el enlace', type: 'imageWithAlt', group: 'seo', description: '1200 × 630 px.'}),
  ],
  preview: {prepare: () => ({title: 'Ajustes del sitio'})},
})
