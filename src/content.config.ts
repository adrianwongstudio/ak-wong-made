import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    year: z.number(),
    client: z.string(),
    services: z.array(z.string()).min(1),
    stack: z.array(z.string()),
    teaser: z.string().max(400).describe('2-3 sentence problem/approach summary shown on the /work/ index'),
    sections: z.array(z.object({
      title:  z.string().optional(),
      blocks: z.array(z.object({
        image:   z.string().optional(),
        caption: z.string().optional(),
        body:    z.string(),
      })).min(1),
    })).min(1).describe('Case study sections. Each section has a title and one or more image+text blocks. Blocks alternate image-left / image-right within the section.'),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    thumb: image().optional(),
    featured: z.boolean().default(false),
    hasCaseStudy: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    hero: image().optional(),
    draft: z.boolean().default(false),
  }),
});

const life = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/life' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    year: z.number(),
    era: z.enum(['Studio Life', 'Corporate Years', 'University', 'Growing Up']),
    type: z.enum(['milestone', 'era-marker', 'birth']).default('milestone'),
    image: image().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { projects, posts, life };
