import { defineType, defineField } from 'sanity';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'clientAnonymised', type: 'string', description: 'e.g. "UK e-commerce brand"' }),
    defineField({ name: 'problem', type: 'text', rows: 3 }),
    defineField({ name: 'solution', type: 'text', rows: 3 }),
    defineField({ name: 'result', type: 'text', rows: 3, description: 'Quantifiable outcome if possible' }),
    defineField({
      name: 'images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'clientAnonymised' },
  },
});
