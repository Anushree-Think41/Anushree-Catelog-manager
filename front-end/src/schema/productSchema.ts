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
