import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  price: z.number().positive(),
  tags: z.array(z.string()),
});

export type ProductSchema = z.infer<typeof productSchema>;

export const optimizedProductSchema = z.object({
  id: z.number(),
  original_product_id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  sku: z.string().nullable(),
  tags: z.string(), // Stored as comma-separated string
  shopify_id: z.string().nullable(),
});

export type OptimizedProductSchema = z.infer<typeof optimizedProductSchema>;
