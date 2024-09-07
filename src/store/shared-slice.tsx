import { type StateCreator } from 'zustand'
import { type BearState, type SharedSlice } from './bear-state'

const getLibraryMap = (categories: CateItem[], navigations: AppItem[]) => {
  const cateItems = [] as CateItem[]
  if (categories) {
    for (const category of categories) {
      cateItems.push({
        ...category,
        children: navigations.filter(e => e.categoryID === category.id),
      })
    }
  }
  return { list: navigations, category: cateItems } satisfies LibraryMap
}

/* TODO: toggle logic here has some problem */
export const createSharedSlice: StateCreator<BearState, [], [], SharedSlice> = (set, get, state) => ({
  getLibraryMap: () => getLibraryMap(get().categories, get().navigations),
  toggleFavorite: (item: AppItem) => {
    if (item.favorite) {
      get().removeItemInFavorites(item)
    } else {
      get().addItemToFavorites(item)
    }
    get().toggleNavigationFavorite(item)
  },
})
