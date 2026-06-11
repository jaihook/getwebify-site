import { defineType, defineField } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'icon', type: 'string', description: 'Emoji or icon name' }),
    defineField({ name: 'cta', type: 'string', description: 'Call-to-action label' }),
    defineField({ name: 'order', type: 'number' }),
  ],
  orderings: [{ title: 'Manual order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});
