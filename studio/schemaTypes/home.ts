import {defineArrayMember, defineField, defineType} from 'sanity'
import {EMPHASIS, eyebrowField, requiredImage} from './objects'

// The home page, section by section in page order
export const home = defineType({
  name: 'home',
  title: 'Página de inicio',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Portada', default: true},
    {name: 'about', title: 'Sobre mí'},
    {name: 'ways', title: 'Cómo trabajar juntos'},
    {name: 'steps', title: '6 pasos'},
    {name: 'testimonials', title: 'Testimonios'},
    {name: 'more', title: 'Blog y contacto'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Portada',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({name: 'title', title: 'Titular', type: 'string', description: EMPHASIS}),
        defineField({name: 'text', title: 'Texto', type: 'text', rows: 2}),
        defineField({
          name: 'cta',
          title: 'Botón',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Texto', type: 'string'}),
            defineField({name: 'href', title: 'Enlace', type: 'string', description: 'Una página del sitio (/servicios) o una dirección completa.'}),
          ],
        }),
        requiredImage('image', 'Foto'),
        defineField({
          name: 'servicesTitle',
          title: 'Título de la tarjeta de servicios',
          type: 'string',
          description: `La lista sale de "Servicios". Escribe *entre asteriscos* lo que va en morado.`,
        }),
        defineField({
          name: 'bookTitle',
          title: 'Título de la tarjeta morada',
          type: 'string',
          description: 'Va sobre los botones "Agendar cita" y "WhatsApp".',
        }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'Sobre mí',
      type: 'object',
      group: 'about',
      fields: [
        eyebrowField(),
        defineField({name: 'quote', title: 'Frase', type: 'text', rows: 2}),
        defineField({name: 'name', title: 'Nombre', type: 'string'}),
        defineField({name: 'role', title: 'Cargo', type: 'string'}),
        defineField({name: 'cta', title: 'Texto del botón', type: 'string'}),
        requiredImage('image', 'Foto (se recorta en círculo)'),
      ],
    }),
    defineField({
      name: 'ways',
      title: '¿Cómo podemos trabajar juntos?',
      type: 'object',
      group: 'ways',
      fields: [
        eyebrowField(),
        defineField({name: 'title', title: 'Título', type: 'string', description: EMPHASIS}),
        defineField({name: 'text', title: 'Bajada', type: 'string'}),
        defineField({
          name: 'items',
          title: 'Modalidades',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'way',
              fields: [
                defineField({name: 'title', title: 'Título', type: 'string'}),
                defineField({name: 'text', title: 'Texto', type: 'text', rows: 3}),
                requiredImage('image', 'Foto (se recorta en círculo)'),
              ],
              preview: {select: {title: 'title', media: 'image'}},
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'steps',
      title: '6 pasos',
      type: 'object',
      group: 'steps',
      fields: [
        defineField({name: 'title', title: 'Título', type: 'string', description: EMPHASIS}),
        defineField({
          name: 'items',
          title: 'Pasos',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description: 'Escribe _entre guiones bajos_ las palabras en negrita.',
        }),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonios',
      type: 'object',
      group: 'testimonials',
      description: 'Los testimonios se cargan en "Testimonios" del menú. Si no hay ninguno publicado, la sección no aparece.',
      fields: [
        eyebrowField(),
        defineField({name: 'title', title: 'Título', type: 'string', description: EMPHASIS}),
      ],
    }),
    defineField({
      name: 'blog',
      title: 'Sección del blog',
      type: 'object',
      group: 'more',
      description: 'Muestra los 3 artículos más recientes. Si no hay artículos, la sección no aparece.',
      fields: [
        eyebrowField(),
        defineField({name: 'title', title: 'Título', type: 'string', description: EMPHASIS}),
        defineField({name: 'text', title: 'Bajada', type: 'string'}),
        defineField({name: 'cta', title: 'Texto del botón', type: 'string'}),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Sección de contacto',
      type: 'object',
      group: 'more',
      fields: [
        eyebrowField(),
        defineField({name: 'title', title: 'Título', type: 'string', description: 'Escribe *entre asteriscos* lo que va en morado.'}),
        defineField({name: 'text', title: 'Bajada', type: 'text', rows: 2}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Página de inicio'})},
})
