import {defineField, defineType} from 'sanity'

// Explained on every headline that supports emphasis (web/src/lib/text.ts → rich())
export const EMPHASIS = 'Escribe *entre asteriscos* lo que va en morado y _entre guiones bajos_ lo que va resaltado.'

// Inner page heroes: the purple part of the title drops to a second line
export const HERO_TITLE = 'Escribe *entre asteriscos* la parte que va en morado, en la segunda línea. Ej.: Hola, soy *Carolina Jaime*'

// Label with a small leaf above a title (Figma "Etiqueta de sección")
export const eyebrowField = (group?: string) =>
  defineField({name: 'eyebrow', title: 'Etiqueta', type: 'string', group, description: 'Texto corto en mayúsculas sobre el título, con una hojita. Ej.: Sobre mí'})

// A photo with its description for screen readers and Google
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Imagen',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Descripción de la imagen',
      type: 'string',
      description: 'Qué se ve en la foto, en pocas palabras. Lo leen los lectores de pantalla y Google.',
    }),
  ],
})

export const requiredImage = (name: string, title: string, description?: string) =>
  defineField({name, title, type: 'imageWithAlt', description, validation: (r) => r.required()})
