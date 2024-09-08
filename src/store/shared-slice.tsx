import { type StateCreator } from 'zustand'
import { type BearState, type SharedSlice } from './bear-state'

const getLibraryMap = (categories: CateItem[], navigations: AppItem[]) => {
  const cateItems = [] as CateItem[]
  if (categories) {
    for (const category of categories) {
      cateItems.push({
        ...category,
        children: navigations.filter(e => e.categoryID === category.id).sort((a, b) => a.order! - b.order!),
      })
    }
  }
  return { list: navigations.sort((a, b) => a.order! - b.order!), category: cateItems } satisfies LibraryMap
}

export const createSharedSlice: StateCreator<BearState, [], [], SharedSlice> = (set, get, state) => ({
  getLibraryMap: () => getLibraryMap(get().categories, get().navigations),
})
