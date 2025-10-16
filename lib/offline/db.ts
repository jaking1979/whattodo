import Dexie, { type Table } from 'dexie'

export interface CachedList {
  id: string
  user_id: string
  title: string
  description?: string
  visibility: string
  slug?: string
  tags?: string[]
  created_at: string
  updated_at: string
  synced_at: string
}

export interface CachedItem {
  id: string
  user_id: string
  list_id: string
  type: string
  title: string
  url?: string
  source?: string
  source_id?: string
  status: string
  notes?: string
  tags?: string[]
  metadata?: any
  added_at: string
  completed_at?: string
  updated_at: string
  synced_at: string
}

export interface OfflineEdit {
  id?: number
  type: 'create' | 'update' | 'delete'
  entity: 'list' | 'item'
  entity_id: string
  data: any
  created_at: string
  synced: boolean
}

class WhatToDoDatabase extends Dexie {
  lists!: Table<CachedList>
  items!: Table<CachedItem>
  offline_edits!: Table<OfflineEdit>

  constructor() {
    super('WhatToDoDatabase')
    this.version(1).stores({
      lists: 'id, user_id, updated_at, synced_at',
      items: 'id, user_id, list_id, status, updated_at, synced_at',
      offline_edits: '++id, entity, entity_id, created_at, synced',
    })
  }
}

export const db = new WhatToDoDatabase()

// Sync functions
export async function cacheLists(lists: any[]) {
  const now = new Date().toISOString()
  const cachedLists = lists.map((list) => ({
    ...list,
    synced_at: now,
  }))
  await db.lists.bulkPut(cachedLists)
}

export async function cacheItems(items: any[]) {
  const now = new Date().toISOString()
  const cachedItems = items.map((item) => ({
    ...item,
    synced_at: now,
  }))
  await db.items.bulkPut(cachedItems)
}

export async function getCachedLists(userId: string) {
  return await db.lists.where('user_id').equals(userId).toArray()
}

export async function getCachedItems(listId: string) {
  return await db.items.where('list_id').equals(listId).toArray()
}

export async function queueOfflineEdit(
  type: 'create' | 'update' | 'delete',
  entity: 'list' | 'item',
  entityId: string,
  data: any
) {
  await db.offline_edits.add({
    type,
    entity,
    entity_id: entityId,
    data,
    created_at: new Date().toISOString(),
    synced: false,
  })
}

export async function getPendingEdits() {
  return await db.offline_edits.where('synced').equals(0).toArray()
}

export async function markEditSynced(editId: number) {
  await db.offline_edits.update(editId, { synced: true })
}

export async function clearSyncedEdits() {
  return await db.offline_edits.where('synced').equals(1).delete()
}

