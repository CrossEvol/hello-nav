export interface CategorySlice {
  categories: CateItem[]
}

export interface NavigationSlice {
  navigations: AppItem[]
  toggleNavigationFavorite: (item: AppItem) => void
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
