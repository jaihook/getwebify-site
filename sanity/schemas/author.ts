import { defineType, defineField } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'bio', type: 'text', rows: 3 }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
});
