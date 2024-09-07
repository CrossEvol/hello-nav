import { type StateCreator } from 'zustand'
import { db } from '../db'
import { type BearState, type CategorySlice } from './bear-state'

const categories = await db.categories.toArray()

export const createCategorySlice: StateCreator<BearState, [], [], CategorySlice> = set => ({
  categories: categories.map(c => ({ ...c, children: [] })),
})
