import { type StateCreator } from 'zustand'
import { db } from '../db'
import { type BearState, type FavoriteSlice } from './bear-state'

const favoriteAppItems = await db.navigations.filter(item => item.favorite === true).toArray()

export const createFavoriteSlice: StateCreator<BearState, [], [], FavoriteSlice> = (set, get) => ({
  favorites: favoriteAppItems,
  getFavoritesCategory: () => ({
    id: 0,
    order: 0,
    icon: '',
    title: 'favorites',
    children: get().favorites,
  }),
  addItemToFavorites: (item: AppItem) => set({ favorites: [...get().favorites, item] }),
  removeItemInFavorites: (item: AppItem) => set({ favorites: [...get().favorites.filter(e => e.id !== item.id)] }),
})
