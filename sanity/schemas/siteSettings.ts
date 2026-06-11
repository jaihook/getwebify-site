import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — one document, managed via Studio structure
  fields: [
    defineField({ name: 'businessName', type: 'string' }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'whatsapp', type: 'string', description: 'E.164 format: 447446508333' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'metaDescription', type: 'text', rows: 2 }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'socialLinks',
      type: 'object',
      fields: [
        defineField({ name: 'linkedin', type: 'url' }),
        defineField({ name: 'instagram', type: 'url' }),
        defineField({ name: 'x', type: 'url' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'businessName' },
  },
});
