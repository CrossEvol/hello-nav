import { type StateCreator } from 'zustand'
import { db } from '../db/db'
import { type BearState, type NavigationSlice } from './bear-state'

const navigations = await db.navigations.toArray()

export const createNavigationSlice: StateCreator<BearState, [], [], NavigationSlice> = (set, get) => ({
  navigations,
  getNavigationsForGrid: () =>
    get().navigations.map(e => ({
      ...e,
      category: get().categoryMapper().get(e.categoryID!),
      lessRadius: e.lessRadius ? e.lessRadius : false,
      darkInvert: e.darkInvert ? e.darkInvert : false,
      hidden: e.hidden ? e.hidden : false,
    })),
  addNavigation: async navigation => {
    return await db.transaction('rw', db.navigations, db.config, db.categories, async () => {
      const category = await db.categories.get(navigation.categoryID)
      const insertedID = await db.navigations.add({
        ...navigation,
        keywords: navigation.keywords?.includes(category!.title)
          ? navigation.keywords
          : [...navigation.keywords!, category!.title],
      })
      if (!insertedID) {
        console.error('failed to insert navigation')
        return
      }
      get().increaseNavigationOrder()
      const newNavigation = (await db.navigations.get(insertedID))!
      return set({ navigations: [...get().navigations, newNavigation] })
    })
  },
  swapNavigation: async (active, over) => {
    const { activeID, activeCategoryID } = active
    const { overID, overCategoryID } = over
    const activeItem = get().navigations.find(item => item.id === activeID)!
    const overItem = get().navigations.find(item => item.id === overID)!

    // when drag inside favorite, target inside favorite then swap , other nothing happened
    if (activeCategoryID === 0) {
      if (overCategoryID === 0) {
        await db.transaction('rw', db.navigations, async () => {
          await db.navigations.update(activeID, { favoriteOrder: overItem.favoriteOrder })
          await db.navigations.update(overID, { favoriteOrder: activeItem.favoriteOrder })
        })
        return set({
          navigations: get()
            .navigations.map(item => (item.id === activeID ? { ...item, favoriteOrder: overItem.favoriteOrder } : item))
            .map(item => (item.id === overID ? { ...item, favoriteOrder: activeItem.favoriteOrder } : item)),
        })
      } else {
        return set({ navigations: get().navigations })
      }
    }

    const navigations =
      activeCategoryID === overCategoryID
        ? get()
            .navigations.map(item => (item.id === activeID ? { ...item, order: overItem?.order } : item))
            .map(item => (item.id === overID ? { ...item, order: activeItem?.order } : item))
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
  insertNavigation: async (active, over) => {
    const { activeID, activeCategoryID } = active
    const { overID, overCategoryID } = over
    const activeItem = get().navigations.find(item => item.id === activeID)!
    const overItem = get().navigations.find(item => item.id === overID)!

    // when drag inside favorite, target inside favorite then swap , other nothing happened
    if (activeCategoryID === 0) {
      if (overCategoryID === 0) {
        const navigations = get().navigations
        const idx = navigations.findIndex(item => item.id === activeID)
        navigations.splice(idx, 1)
        const left = navigations.filter(item => item.favoriteOrder! < overItem.favoriteOrder!)
        const right = navigations
          .filter(item => item.favoriteOrder! >= overItem.favoriteOrder!)
          .map(item => ({ ...item, favoriteOrder: item.favoriteOrder! + 1 }))

        const newNavigations = [...left, { ...activeItem, favoriteOrder: overItem.favoriteOrder }, ...right]

        await db.transaction('rw', db.navigations, async () => {
          await Promise.all(
            newNavigations.map(
              async (item, _) => await db.navigations.update(item.id, { favoriteOrder: item.favoriteOrder }),
            ),
          )
        })
        return set({
          navigations: newNavigations,
        })
      } else {
        return set({ navigations: get().navigations })
      }
    }

    if (activeCategoryID === overCategoryID) {
      // insert inside the same Category
      // insert logic is the same as inside favorite category, but here use order instead of favoriteOrder
      const navigations = get().navigations
      const idx = navigations.findIndex(item => item.id === activeID)
      navigations.splice(idx, 1)
      const left = navigations.filter(item => item.order! < overItem.order!)
      const right = navigations
        .filter(item => item.order! >= overItem.order!)
        .map(item => ({ ...item, order: item.order! + 1 }))

      const newNavigations = [...left, { ...activeItem, order: overItem.order }, ...right]

      await db.transaction('rw', db.navigations, async () => {
        await Promise.all(
          newNavigations.map(async (item, _) => await db.navigations.update(item.id, { order: item.order })),
        )
      })
      return set({
        navigations: newNavigations,
      })
    } else {
      // insert inside the different Category
      const navigations = get().navigations
      const idx = navigations.findIndex(item => item.id === activeID)
      navigations.splice(idx, 1)
      const left = navigations.filter(item => item.order! < overItem.order!)
      const right = navigations
        .filter(item => item.order! >= overItem.order!)
        .map(item => ({ ...item, order: item.order! + 1 }))

      const newNavigations = [
        ...left,
        { ...activeItem, order: overItem.order, categoryID: overItem.categoryID },
        ...right,
      ]

      await db.transaction('rw', db.navigations, async () => {
        await Promise.all(
          newNavigations.map(async (item, _) => await db.navigations.update(item.id, { order: item.order })),
        )
        await db.navigations.update(activeItem.id, { categoryID: overItem.categoryID })
      })
      return set({
        navigations: newNavigations,
      })
    }
  },
})
