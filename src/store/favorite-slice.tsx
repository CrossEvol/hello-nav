import { type StateCreator } from 'zustand'
import { type BearState, type FavoriteSlice } from './bear-state'

export const createFavoriteSlice: StateCreator<BearState, [], [], FavoriteSlice> = (set, get) => ({
  getFavoritesCategory: () => ({
    id: 0,
    order: 0,
    icon: '',
    title: 'favorites',
    children: get()
      .navigations.filter(item => item.favorite)
      .sort((a, b) => a.order! - b.order!),
  }),
})
