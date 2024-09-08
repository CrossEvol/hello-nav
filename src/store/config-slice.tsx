import { type StateCreator } from 'zustand'
import { db } from '../db'
import { type BearState, type ConfigSlice } from './bear-state'

const count = await db.config.count()
const categoryOrderID = (await db.config.where({ id: 1 }).toArray())[0].categoryOrderID
const navigationOrderID = (await db.config.where({ id: 1 }).toArray())[0].navigationOrderID

export const createConfigSlice: StateCreator<BearState, [], [], ConfigSlice> = (set, get) => ({
  initialized: count !== 0,
  categoryOrderID: categoryOrderID!,
  navigationOrderID: navigationOrderID!,
  initializeDatabase: async () => {
    if (get().initialized) return
    const categories = await db.categories.toArray()
    const navigations = await db.navigations.toArray()
    set({ categories: categories.map(c => ({ ...c, children: [] })), navigations, initialized: true })
  },
  increaseCategoryOrder: async () => {
    const nextOrder = get().categoryOrderID + 1
    await db.config.update(1, { categoryOrderID: nextOrder })
    return set({ categoryOrderID: nextOrder })
  },
  increaseNavigationOrder: async () => {
    const nextOrder = get().navigationOrderID + 1
    await db.config.update(1, { navigationOrderID: nextOrder })
    return set({ navigationOrderID: nextOrder })
  },
})
