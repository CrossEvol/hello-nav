/* eslint-disable no-unused-vars */
declare interface AppItem {
  id: number
  name: string
  homepage: string
  repository?: string
  icon: string
  category?: string
  keywords?: string[]
  darkInvert?: true
  lessRadius?: true
  favorite?: boolean
  hidden?: boolean
  first?: boolean
  final?: boolean
  order?: number
}

declare interface CateItem {
  title: string
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
  toggleType: any
  toggleSetting: any
  type: string
}

declare interface ContainWrapProp {
  list: AppItem[] | CateItem[]
  type: string
}

declare interface WithErrorProps {
  isError: boolean
  [propName: string]: any
}
