import { defineType, defineField } from 'sanity';

export const affiliateProduct = defineType({
  name: 'affiliateProduct',
  title: 'Affiliate Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 2 }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'affiliateUrl',
      type: 'url',
      description: 'Full affiliate URL including tracking params',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: ['Website Builders', 'Hosting', 'Design Tools', 'Marketing', 'Productivity', 'Other'],
      },
    }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'logo' },
  },
});
