export interface CategorySlice {
  categories: CateItem[]
}

export interface NavigationSlice {
  navigations: AppItem[]
  toggleNavigationFavorite: (item: AppItem) => void
}

export interface FavoriteSlice {
  favorites: AppItem[]
  getFavoritesCategory: () => Omit<CateItem, 'title'> & { title: 'favorites' }
  addItemToFavorites: (item: AppItem) => void
  removeItemInFavorites: (item: AppItem) => void
}

export interface SharedSlice {
  getLibraryMap: () => LibraryMap
  toggleFavorite: (item: AppItem) => void
}

export type BearState = CategorySlice & NavigationSlice & FavoriteSlice & SharedSlice
