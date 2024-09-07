import { type StateCreator } from 'zustand'
import { db } from '../db'
import { type BearState, type ConfigSlice } from './bear-state'

const count = await db.config.count()

export const createConfigSlice: StateCreator<BearState, [], [], ConfigSlice> = (set, get) => ({
  initialized: count !== 0,
  initializeDatabase: async () => {
    if (get().initialized) return
    const categories = await db.categories.toArray()
    const navigations = await db.navigations.toArray()
    set({ categories: categories.map(c => ({ ...c, children: [] })), navigations, initialized: true })
  },
})
