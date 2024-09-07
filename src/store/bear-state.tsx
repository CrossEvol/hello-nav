export interface CategorySlice {
  categories: CateItem[]
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
  toggleNavigationFavorite: (item: AppItem) => void
  swapNavigation: (active: Active, over: Over) => void
}

export interface FavoriteSlice {
  getFavoritesCategory: () => Omit<CateItem, 'title'> & { title: 'favorites' }
}

export interface SharedSlice {
  getLibraryMap: () => LibraryMap
}

export interface ConfigSlice {
  initialized: boolean
  initializeDatabase: () => void
}

export type BearState = SharedSlice & CategorySlice & NavigationSlice & FavoriteSlice & ConfigSlice
