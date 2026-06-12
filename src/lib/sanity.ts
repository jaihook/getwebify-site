import { sanityClient } from 'sanity:client';
import { createClient } from '@sanity/client';
import { defineQuery } from 'groq';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Server-side write client — only used in API routes, never in static pages
const writeClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: import.meta.env.SANITY_API_TOKEN,
  useCdn: false,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ---- Queries ----

export const POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id, title, slug, excerpt, publishedAt, coverImage, hasAffiliates,
    "author": author->{ name, image }
  }`
);

export const POST_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, excerpt, publishedAt, coverImage, body, hasAffiliates, seoMeta,
    "author": author->{ name, image },
    "affiliateProducts": affiliateProducts[]->{ _id, name, description, logo, affiliateUrl, category }
  }`
);

export const SERVICES_QUERY = defineQuery(
  `*[_type == "service"] | order(order asc) { _id, title, description, icon, cta }`
);

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0] { businessName, tagline, whatsapp, email, metaDescription, logo, socialLinks }`
);

export const REVIEWS_QUERY = defineQuery(
  `*[_type == "review"] | order(date desc) { _id, clientName, rating, quote, projectType, date, featured }`
);

export const CASE_STUDIES_QUERY = defineQuery(
  `*[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc) {
    _id, title, slug, clientAnonymised, problem, result, images, publishedAt
  }`
);

export const CASE_STUDY_QUERY = defineQuery(
  `*[_type == "caseStudy" && slug.current == $slug][0] {
    _id, title, slug, clientAnonymised, problem, solution, result, images, publishedAt
  }`
);

export const AFFILIATE_PRODUCTS_QUERY = defineQuery(
  `*[_type == "affiliateProduct"] | order(featured desc, name asc) {
    _id, name, description, logo, affiliateUrl, category, featured
  }`
);

// ---- Fetch helpers ----

export async function getPosts() {
  return sanityClient.fetch(POSTS_QUERY);
}
export async function getPost(slug: string) {
  return sanityClient.fetch(POST_QUERY, { slug });
}
export async function getServices() {
  return sanityClient.fetch(SERVICES_QUERY);
}
export async function getSiteSettings() {
  return sanityClient.fetch(SITE_SETTINGS_QUERY);
}
export async function getReviews() {
  return sanityClient.fetch(REVIEWS_QUERY);
}
export async function getCaseStudies() {
  return sanityClient.fetch(CASE_STUDIES_QUERY);
}
export async function getCaseStudy(slug: string) {
  return sanityClient.fetch(CASE_STUDY_QUERY, { slug });
}
export async function getAffiliateProducts() {
  return sanityClient.fetch(AFFILIATE_PRODUCTS_QUERY);
}

export interface LeadData {
  name: string;
  business: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}

export async function createLead(data: LeadData): Promise<void> {
  if (!import.meta.env.SANITY_API_TOKEN) return;
  await writeClient.create({
    _type: 'lead',
    ...data,
    submittedAt: new Date().toISOString(),
    status: 'new',
  });
}
