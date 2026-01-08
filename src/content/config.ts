import { defineCollection, z } from 'astro:content';

// Schema für Projekte
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    client: z.string().optional(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    cover: z.string().optional(), // Pfad zum Bild
    excerpt: z.string().optional(),
    // Case Study Felder
    goal: z.string().optional(),
    challenge: z.string().optional(),
    solution: z.string().optional(),
    process: z.string().optional(),
    results: z.string().optional(),
    tech: z.array(z.string()).optional(),
    testimonial: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string().optional(),
    }).optional(),
    featured: z.boolean().default(false),
  }),
});

// Schema für News/Blog
const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    cover: z.string().optional(),
    excerpt: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  'projects': projectsCollection,
  'news': newsCollection,
};
