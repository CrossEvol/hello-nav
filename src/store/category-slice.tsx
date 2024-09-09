import chroma from 'chroma-js'
import { type StateCreator } from 'zustand'
import { type ColourOption } from '../components/Select/select-data'
import { db } from '../db'
import { type BearState, type CategorySlice } from './bear-state'

const categories = await db.categories.toArray()

export const createCategorySlice: StateCreator<BearState, [], [], CategorySlice> = (set, get) => ({
  categories: categories.map(c => ({ ...c, children: [] })),
  categoryMapper: () =>
    categories.reduce((acc, cur) => {
      acc.set(cur.id!, cur.title)
      return acc
    }, new Map<number, string>()),
  getCategoryOptions: () => {
    const options = get().categories.map(item => ({
      value: item.id!.toString(),
      label: item.title,
      color: chroma.random().hex(),
    })) satisfies ColourOption[]
    return options
  },
  addCategory: async category => {
    return await db.transaction('rw', db.categories, db.config, async () => {
      const insertedID = await db.categories.add({ ...category })
      if (!insertedID) {
        console.error('failed to insert category')
        return
      }
      get().increaseCategoryOrder()
      const newCategory = (await db.categories.get(insertedID))!
      return set({ categories: [...get().categories, { ...newCategory, children: [] }] })
    })
  },
  getCategoriesWithCount: () =>
    get().categories.map(c => ({
      ...c,
      count: get().navigations.filter(e => e.categoryID === c.id).length,
    })),
})
