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
    blocks: z.array(z.object({
      chapterTitle: z.string().optional(),
      image:        z.string().optional(),
      caption:      z.string().optional(),
      body:         z.string(),
    })).min(1).describe('Case study body — a flat list of blocks. Set chapterTitle on a block to start a new chapter (blocks under a chapter alternate image-left/right).'),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    thumb: z.string().optional(),
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
    hero: z.string().optional(),
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
    category: z.enum(['career', 'volunteer']).default('career').describe('Which column the milestone appears in on /life/ — career on the left, volunteer on the right.'),
    image: image().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { projects, posts, life };
