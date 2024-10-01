import { type StateCreator } from 'zustand'
import { db } from '../db'
import { type BearState, type FavoriteSlice } from './bear-state'

export const createFavoriteSlice: StateCreator<BearState, [], [], FavoriteSlice> = (set, get) => ({
  getFavoritesCategory: () => {
    const favorites = get().navigations.filter(item => item.favorite)
    return {
      id: 0,
      order: 0,
      icon: '',
      title: 'favorites',
      children: favorites
        .map(e => ({ ...e, categoryID: 0 }))
        .sort((a, b) => a.favoriteOrder! - b.favoriteOrder!)
        .map((e, index) =>
          index === 0
            ? { ...e, first: true }
            : index === favorites.length - 1
              ? { ...e, final: true }
              : { ...e, first: false, final: false },
        ),
    }
  },
  toggleNavigationFavorite: async itemID => {
    const favoriteOrder = await db.transaction('rw', db.navigations, db.config, async () => {
      const targetItem = await db.navigations.get(itemID)!
      if (!targetItem) {
        console.error(`can not find navigation itemID#${itemID}`)
        return -1
      }
      if (targetItem.favorite) {
        await db.navigations.update(itemID, { favorite: false, favoriteOrder: 0 })
        return -1
      } else {
        const config = await db.config.get(1)
        const nextFavoriteOrder = config!.favoriteOrderID! + 1
        await db.config.update(1, { favoriteOrderID: nextFavoriteOrder })
        await db.navigations.update(itemID, { favorite: true, favoriteOrder: nextFavoriteOrder })
        return nextFavoriteOrder
      }
    })
    return set({
      navigations: get().navigations.map(e =>
        e.id === itemID ? { ...e, favorite: !e.favorite, favoriteOrder: favoriteOrder! } : e,
      ),
    })
  },
  moveLeft: itemID => {
    const favorites = get().getFavoritesCategory().children
    const index = favorites.findIndex(e => e.id === itemID)
    if (index === -1) return
    if (index === 0) return
    const curr = favorites[index]
    const prev = favorites[index - 1]

    set({
      navigations: get()
        .navigations.map(item => (item.id === curr.id ? { ...item, favoriteOrder: prev.favoriteOrder } : item))
        .map(item => (item.id === prev.id ? { ...item, favoriteOrder: curr.favoriteOrder } : item)),
    })
  },
  moveRight: itemID => {
    const favorites = get().getFavoritesCategory().children
    const index = favorites.findIndex(e => e.id === itemID)
    if (index === -1) return
    if (index === favorites.length - 1) return
    const curr = favorites[index]
    const next = favorites[index + 1]

    set({
      navigations: get()
        .navigations.map(item => (item.id === curr.id ? { ...item, favoriteOrder: next.favoriteOrder } : item))
        .map(item => (item.id === next.id ? { ...item, favoriteOrder: curr.favoriteOrder } : item)),
    })
  },
})
