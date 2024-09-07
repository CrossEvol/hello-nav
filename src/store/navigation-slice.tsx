import { type StateCreator } from 'zustand'
import { db } from '../db'
import { type BearState, type NavigationSlice } from './bear-state'

const navigations = await db.navigations.toArray()

export const createNavigationSlice: StateCreator<BearState, [], [], NavigationSlice> = (set, get) => ({
  navigations,
  toggleNavigationFavorite: (item: AppItem) =>
    set({ navigations: get().navigations.map(e => (e.id === item.id ? { ...e, favorite: item.favorite } : e)) }),
})
