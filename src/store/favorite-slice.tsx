import { type StateCreator } from 'zustand'
import { db } from '../db'
import { type BearState, type FavoriteSlice } from './bear-state'

export const createFavoriteSlice: StateCreator<BearState, [], [], FavoriteSlice> = (set, get) => ({
  getFavoritesCategory: () => ({
    id: 0,
    order: 0,
    icon: '',
    title: 'favorites',
    children: get()
      .navigations.filter(item => item.favorite)
      .map(e => ({ ...e, categoryID: 0 }))
      .sort((a, b) => a.favoriteOrder! - b.favoriteOrder!),
  }),
  toggleNavigationFavorite: async itemID => {
    const favoriteOrder = await db.transaction('rw', db.navigations, db.config, async () => {
      const targetItem = await db.navigations.get(itemID)!
      if (!targetItem) {
        console.error(`can not find navigation itemID#${itemID}`)
        return
      }
      if (targetItem.favorite) {
        await db.navigations.update(itemID, { favorite: false, favoriteOrder: 0 })
      }
      const config = await db.config.get(1)
      const nextFavoriteOrder = config!.favoriteOrderID! + 1
      await db.config.update(1, { favoriteOrderID: nextFavoriteOrder })
      await db.navigations.update(itemID, { favorite: true, favoriteOrder: nextFavoriteOrder })
      return nextFavoriteOrder
    })
    return set({
      navigations: get().navigations.map(e =>
        e.id === itemID ? { ...e, favorite: !e.favorite, favoriteOrder: favoriteOrder! } : e,
      ),
    })
  },
})
