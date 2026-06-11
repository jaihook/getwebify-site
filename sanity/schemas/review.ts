import { defineType, defineField } from 'sanity';

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({ name: 'clientName', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'rating',
      type: 'number',
      validation: (r) => r.required().min(1).max(5),
      options: { list: [1, 2, 3, 4, 5] },
    }),
    defineField({ name: 'quote', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'projectType', type: 'string' }),
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'clientName', subtitle: 'quote' },
  },
});
