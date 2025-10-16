import { z } from 'zod'

// Profile schemas
export const profileSchema = z.object({
  handle: z.string().min(3).max(50).regex(/^[a-z0-9_]+$/i),
  display_name: z.string().min(1).max(100).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
})

export const updateProfileSchema = profileSchema.partial()

// List schemas
export const listVisibilitySchema = z.enum(['private', 'unlisted', 'public'])

export const createListSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  visibility: listVisibilitySchema.default('private'),
  group_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  cover_url: z.string().url().optional().nullable(),
})

export const updateListSchema = createListSchema.partial().extend({
  id: z.string().uuid(),
})

// Item schemas
export const itemTypeSchema = z.enum(['movie', 'show', 'book', 'podcast', 'game', 'boardgame', 'app', 'link'])
export const itemStatusSchema = z.enum(['saved', 'started', 'done'])

export const createItemSchema = z.object({
  list_id: z.string().uuid(),
  type: itemTypeSchema,
  title: z.string().min(1).max(500),
  url: z.string().url().optional().nullable(),
  source: z.string().optional().nullable(),
  source_id: z.string().optional().nullable(),
  status: itemStatusSchema.default('saved'),
  notes: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
})

export const updateItemSchema = createItemSchema.partial().extend({
  id: z.string().uuid(),
})

export const updateItemStatusSchema = z.object({
  id: z.string().uuid(),
  status: itemStatusSchema,
  completed_at: z.string().datetime().optional().nullable(),
})

// Group schemas
export const createGroupSchema = z.object({
  name: z.string().min(1).max(100),
  position: z.number().int().optional().nullable(),
})

export const updateGroupSchema = createGroupSchema.partial().extend({
  id: z.string().uuid(),
})

// Marketplace schemas
export const createMarketplaceListingSchema = z.object({
  list_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  summary: z.string().max(1000).optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  is_indexable: z.boolean().default(true),
})

export const updateMarketplaceListingSchema = createMarketplaceListingSchema.partial().extend({
  id: z.string().uuid(),
})

// Lookup/search schemas
export const lookupSchema = z.object({
  query: z.string().min(1),
  type: itemTypeSchema.optional(),
})

export const searchMarketplaceSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Type exports for use in components
export type ListVisibility = z.infer<typeof listVisibilitySchema>
export type ItemType = z.infer<typeof itemTypeSchema>
export type ItemStatus = z.infer<typeof itemStatusSchema>
export type CreateListInput = z.infer<typeof createListSchema>
export type UpdateListInput = z.infer<typeof updateListSchema>
export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>
export type CreateMarketplaceListingInput = z.infer<typeof createMarketplaceListingSchema>
export type LookupInput = z.infer<typeof lookupSchema>
export type SearchMarketplaceInput = z.infer<typeof searchMarketplaceSchema>

