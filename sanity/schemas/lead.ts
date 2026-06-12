import { defineType, defineField } from 'sanity';

export const lead = defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', readOnly: true }),
    defineField({ name: 'business', type: 'string', readOnly: true }),
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', type: 'string', readOnly: true }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      readOnly: true,
    }),
    defineField({ name: 'message', type: 'text', readOnly: true }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime', readOnly: true }),
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Proposal Sent', value: 'proposal' },
          { title: 'Won', value: 'won' },
          { title: 'Lost', value: 'lost' },
        ],
      },
    }),
    defineField({ name: 'notes', type: 'text', rows: 4 }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'projectType',
      description: 'status',
    },
    prepare({ title, subtitle, description }) {
      return {
        title: title ?? 'Unknown',
        subtitle: `${subtitle ?? '—'} · ${description ?? 'new'}`,
      };
    },
  },
  orderings: [
    { title: 'Newest first', name: 'submittedAtDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
});
