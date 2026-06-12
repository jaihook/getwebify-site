import { defineType, defineField } from 'sanity';

export const prospect = defineType({
  name: 'prospect',
  title: 'Prospect',
  type: 'document',
  fields: [
    defineField({ name: 'businessName', title: 'Business Name', type: 'string', readOnly: true }),
    defineField({ name: 'website', type: 'url', readOnly: true }),
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', type: 'string', readOnly: true }),
    defineField({ name: 'trade', type: 'string', readOnly: true }),
    defineField({ name: 'city', type: 'string', readOnly: true }),
    defineField({ name: 'siteScore', title: 'Site Problem Score', type: 'number', readOnly: true }),
    defineField({ name: 'siteIssues', title: 'Site Issues', type: 'array', of: [{ type: 'string' }], readOnly: true }),
    defineField({
      name: 'outreachStatus',
      title: 'Status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Sent', value: 'sent' },
          { title: 'Replied', value: 'replied' },
          { title: 'Meeting Booked', value: 'booked' },
          { title: 'Won', value: 'won' },
          { title: 'Lost', value: 'lost' },
        ],
      },
    }),
    defineField({ name: 'emailSentAt', title: 'Email Sent At', type: 'datetime', readOnly: true }),
    defineField({ name: 'notes', type: 'text', rows: 4 }),
  ],
  preview: {
    select: {
      title: 'businessName',
      subtitle: 'trade',
      city: 'city',
      status: 'outreachStatus',
    },
    prepare({ title, subtitle, city, status }) {
      return {
        title: title ?? 'Unknown',
        subtitle: `${subtitle ?? '—'} · ${city ?? '—'} · ${status ?? 'pending'}`,
      };
    },
  },
  orderings: [
    { title: 'Highest score first', name: 'siteScoreDesc', by: [{ field: 'siteScore', direction: 'desc' }] },
    { title: 'Newest first', name: 'emailSentAtDesc', by: [{ field: 'emailSentAt', direction: 'desc' }] },
  ],
});
