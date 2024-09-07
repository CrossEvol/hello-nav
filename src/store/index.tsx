import { create } from 'zustand'
import { type BearState } from './bear-state'
import { createCategorySlice } from './category-slice'
import { createFavoriteSlice } from './favorite-slice'
import { createNavigationSlice } from './navigation-slice'
import { createSharedSlice } from './shared-slice'

export const useBearStore = create<BearState>((...a) => ({
  ...createCategorySlice(...a),
  ...createNavigationSlice(...a),
  ...createFavoriteSlice(...a),
  ...createSharedSlice(...a),
}))
