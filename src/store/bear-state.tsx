import { z } from 'zod'
import { type ColourOption } from '../components/Select/select-data'
import { type Category, type Navigation } from '../db/db'

export type CategoryWithCount = Omit<CateItem, 'children'> & { count: number }

export interface CategorySlice {
  categories: CateItem[]
  categoryMapper: () => Map<number, string>
  getCategoriesWithCount: () => CategoryWithCount[]
  getCategoryOptions: () => ColourOption[]
  addCategory: (category: Omit<Category, 'id'>) => void
}

type Active = {
  activeID: number
  activeCategoryID: number
}

type Over = {
  overID: number
  overCategoryID: number
}

type Exports = {
  categories: (Omit<CateItem, 'id' | 'order' | 'children'> & {
    children: Omit<AppItem, 'id' | 'order' | 'categoryID' | 'favoriteOrder'>[]
  })[]
}

export type GridAppItem = {
  id?: number
  name: string
  homepage: string
  repository?: string
  icon: string
  category?: string
  keywords?: string[]
  darkInvert: boolean
  lessRadius: boolean
  hidden: boolean
  order?: number
}

export interface NavigationSlice {
  navigations: AppItem[]
  getNavigationsForGrid: () => GridAppItem[]
  swapNavigation: (active: Active, over: Over) => void
  insertNavigation: (active: Active, over: Over) => void
  addNavigation: (category: Omit<Navigation, 'id'>) => void
}

export interface FavoriteSlice {
  toggleNavigationFavorite: (id: number) => void
  getFavoritesCategory: () => Omit<CateItem, 'title'> & { title: 'favorites' }
  moveLeft: (id: number) => void
  moveRight: (id: number) => void
}

export interface SharedSlice {
  imports: (data: unknown) => void
  getExports: () => Exports
  getLibraryMap: () => LibraryMap
}

export interface ConfigSlice {
  initialized: boolean
  initializeDatabase: () => void
  categoryOrderID: number
  increaseCategoryOrder: () => void
  increaseNavigationOrder: () => void
  navigationOrderID: number
}

export type BearState = SharedSlice & CategorySlice & NavigationSlice & FavoriteSlice & ConfigSlice

// 定义 Zod schema
const AppItemSchema = z.object({
  name: z.string(),
  homepage: z.string(),
  repository: z.string().optional(),
  icon: z.string(),
  categoryID: z.number().optional(),
  keywords: z.array(z.string()).optional(),
  darkInvert: z.boolean().default(false),
  lessRadius: z.boolean().default(false),
  hidden: z.boolean().default(false),
})

const CategorySchema = z.object({
  title: z.string(),
  icon: z.string(),
  order: z.number().optional(),
  children: z.array(AppItemSchema),
})

export const ImportsSchema = z.object({
  categories: z.array(CategorySchema),
})
