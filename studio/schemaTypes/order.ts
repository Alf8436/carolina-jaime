import {defineField} from 'sanity'

// Position in lists (services, workshops): lower goes first
export const orderRankField = defineField({
  name: 'order',
  title: 'Orden',
  type: 'number',
  description: 'Posición en la lista: 1 va primero.',
  initialValue: 10,
})
