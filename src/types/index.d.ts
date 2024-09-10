declare interface AppItem {
  id?: number
  name: string
  homepage: string
  repository?: string
  icon: string
  category?: string
  categoryID?: number
  keywords?: string[]
  darkInvert?: boolean
  lessRadius?: boolean
  favorite?: boolean
  hidden?: boolean
  first?: boolean
  final?: boolean
  order?: number
  favoriteOrder?: number
}

declare interface CateItem {
  id?: number
  title: string
  icon?: string
  order?: number
  children: AppItem[]
}

declare type CategoryType = 'list' | 'category'

declare interface LibraryMap {
  list: AppItem[]
  category: CateItem[]
}

declare interface FilterProps {
  onInput(e: React.FormEvent): void
  onClear(): void
  filterKey: string
  toggleType: () => void
  toggleSetting: () => void
  type: string
}

declare interface ContainWrapProp {
  list: AppItem[] | CateItem[]
  type: string
}

declare interface WithErrorProps {
  list: AppItem[] | CateItem[]
  type: string
  filterKey: string
  isSettingMode: boolean
  resultAppCount: number
  isError: boolean
}

declare interface PropsWithOpen {
  open: boolean
  setOpen: (open: boolean) => void
}

declare interface PropsWithState<T> {
  value: T
  setValue: (value: T) => void
}
