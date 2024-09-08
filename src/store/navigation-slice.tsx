import { type StateCreator } from 'zustand'
import { db } from '../db/db'
import { type BearState, type NavigationSlice } from './bear-state'

const navigations = await db.navigations.toArray()

export const createNavigationSlice: StateCreator<BearState, [], [], NavigationSlice> = (set, get) => ({
  navigations: navigations.sort((a, b) => a.order! - b.order!),
  swapNavigation: async (active, over) => {
    const { activeID, activeCategoryID } = active
    const { overID, overCategoryID } = over
    const activeItem = get().navigations.find(item => item.id === activeID)!
    const overItem = get().navigations.find(item => item.id === overID)!
    const navigations =
      activeCategoryID === overCategoryID
        ? get()
            .navigations.map(item => (item.id === activeID ? { ...item, order: overItem?.order } : item))
            .map(item => (item.id === overID ? { ...item, order: activeItem?.order } : item))
            .sort((a, b) => a.order! - b.order!)
        : get()
            .navigations.map(item =>
              item.id === activeID
                ? { ...overItem, id: activeItem.id, order: activeItem?.order, categoryID: activeItem.categoryID }
                : item,
            )
            .map(item =>
              item.id === overID
                ? { ...activeItem, id: overItem.id, order: overItem?.order, categoryID: overItem.categoryID }
                : item,
            )
            .sort((a, b) => a.order! - b.order!)
    try {
      if (activeCategoryID === overCategoryID) {
        await db.transaction('rw', db.navigations, async () => {
          await db.navigations.update(activeID, { order: overItem.order })
          await db.navigations.update(overID, { order: activeItem.order })
        })
      } else {
        await db.transaction('rw', db.navigations, async () => {
          await db.navigations.update(activeID, { order: overItem.order, categoryID: overItem.categoryID })
          await db.navigations.update(overID, { order: activeItem.order, categoryID: activeItem.categoryID })
        })
      }
    } catch (error) {
      console.error('transaction about swap order between navigations failed: ')
      console.error(error)
      throw error
    }
    return set({ navigations })
  },
})
