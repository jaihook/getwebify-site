import { defineType, defineField } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'hasAffiliates',
      title: 'Contains affiliate links',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'affiliateProducts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'affiliateProduct' }] }],
      hidden: ({ document }) => !document?.hasAffiliates,
    }),
    defineField({
      name: 'seoMeta',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', type: 'string' }),
        defineField({ name: 'metaDescription', type: 'text', rows: 2 }),
        defineField({ name: 'ogImage', type: 'image' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'coverImage' },
  },
});
