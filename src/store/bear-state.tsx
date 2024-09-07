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

export type BearState = CategorySlice & NavigationSlice & FavoriteSlice & SharedSlice
