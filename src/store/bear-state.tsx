import { type ColourOption } from '../components/Select/select-data'
import { type Category, type Navigation } from '../db/db'

export type CategoryWithCount = Omit<CateItem, 'children'> & { count: number }

export interface CategorySlice {
  categories: CateItem[]
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

export interface NavigationSlice {
  navigations: AppItem[]
  swapNavigation: (active: Active, over: Over) => void
  addNavigation: (category: Omit<Navigation, 'id'>) => void
}

export interface FavoriteSlice {
  toggleNavigationFavorite: (id: number) => void
  getFavoritesCategory: () => Omit<CateItem, 'title'> & { title: 'favorites' }
  moveLeft: (id: number) => void
  moveRight: (id: number) => void
}

export interface SharedSlice {
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
