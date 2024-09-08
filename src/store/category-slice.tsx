import { type StateCreator } from 'zustand'
import { type BearState, type CategorySlice } from './bear-state'
import { db } from '../db'

const categories = await db.categories.toArray()

export const createCategorySlice: StateCreator<BearState, [], [], CategorySlice> = set => ({
  categories: categories.map(c => ({ ...c, children: [] })),
})
