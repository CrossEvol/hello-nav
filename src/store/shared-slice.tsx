import { type StateCreator } from 'zustand'
import { db } from '../db'
import { type Navigation } from '../db/db'
import { ImportsSchema, type BearState, type SharedSlice } from './bear-state'

export const createSharedSlice: StateCreator<BearState, [], [], SharedSlice> = (set, get, state) => ({
  getLibraryMap: () => getLibraryMap(get().categories, get().navigations),
  imports: async data => {
    const parsedResult = ImportsSchema.safeParse(data)

    if (!parsedResult.success) {
      parsedResult.error.errors.forEach(err => console.error(err))
      return
    }
    const { categories } = parsedResult.data
    const categoryMap = get().categories.reduce((acc, cur) => {
      acc.set(cur.title, cur.id!)
      return acc
    }, new Map<string, number>())

    const navigationKey = (item: Navigation) => [item.name, item.homepage, item.repository].join('$')

    const navigationSet = get().navigations.map(n => navigationKey(n))

    // TODO: I want to combine here, but it will throw DexieInsideError for NotFound
    for (const category of categories.filter(c => categoryMap.has(c.title))) {
      db.transaction('rw', db.config, db.navigations, async () => {
        const { navigationOrderID } = (await db.config.get(1))!
        const categoryID = categoryMap.get(category.title)
        await db.navigations.bulkPut(
          category.children
            .filter(n => !navigationSet.includes(navigationKey(n)))
            .map((n, index) => ({
              ...n,
              categoryID,
              order: navigationOrderID! + index,
            })),
        )
        await db.config.update(1, {
          navigationOrderID: navigationOrderID! + category.children.length,
        })
      })
        .then(async () => {
          set({
            categories: (await db.categories.toArray()).map(c => ({ ...c, children: [] })),
            navigations: await db.navigations.toArray(),
          })
        })
        .catch(reason => console.error(reason))
    }
    for (const category of categories.filter(c => !categoryMap.has(c.title))) {
      db.transaction('rw', db.config, db.navigations, db.categories, async () => {
        const { navigationOrderID, categoryOrderID } = (await db.config.get(1))!
        const categoryID = await db.categories.put({ ...category, order: categoryOrderID! + 1 })
        await db.navigations.bulkPut(
          category.children
            .filter(n => !navigationSet.includes(navigationKey(n)))
            .map((n, index) => ({ ...n, categoryID, order: navigationOrderID! + index })),
        )
        await db.config.update(1, {
          categoryOrderID: categoryID! + 1,
          navigationOrderID: navigationOrderID! + category.children.length,
        })
      })
        .then(async () => {
          set({
            categories: (await db.categories.toArray()).map(c => ({ ...c, children: [] })),
            navigations: await db.navigations.toArray(),
          })
        })
        .catch(reason => console.error(reason))
    }
  },
  getExports: () => ({
    categories: get().categories.map(c => ({
      ...c,
      id: undefined,
      order: undefined,
      children: get()
        .navigations.filter(n => n.categoryID === c.id)
        .map(n => ({ ...n, id: undefined, order: undefined, favoriteOrder: undefined, categoryID: undefined })),
    })),
  }),
})

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
