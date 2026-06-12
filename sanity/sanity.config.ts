import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;

export default defineConfig({
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.documentTypeListItem('post').title('Blog Posts'),
            S.documentTypeListItem('caseStudy').title('Case Studies'),
            S.documentTypeListItem('review').title('Reviews'),
            S.documentTypeListItem('service').title('Services'),
            S.divider(),
            S.documentTypeListItem('affiliateProduct').title('Affiliate Products'),
            S.documentTypeListItem('author').title('Authors'),
            S.divider(),
            S.documentTypeListItem('lead').title('Leads'),
            S.documentTypeListItem('prospect').title('Prospects'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
