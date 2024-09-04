import Dexie, { type Table } from 'dexie'

export type Navigation = {
  id?: number
  name: string
  homepage: string
  repository?: string
  icon: string
  keywords?: string[]
  darkInvert?: true
  lessRadius?: true
  favorite?: boolean
  hidden?: boolean
  first?: boolean
  final?: boolean
  order?: number
  categoryID?: number
}

export type Category = {
  id?: number
  title: string
}

interface OrderID {
  id?: number
}

class NavAppDatabase extends Dexie {
  navigations!: Table<Navigation>
  categories!: Table<Category>
  orderID!: Table<OrderID>

  constructor() {
    super('NavAppDatabase')
    this.version(1).stores({
      navigations:
        '++id, name, homepage, repository, icon, keywords, darkInvert, lessRadius, favorite, hidden, first, final, order, categoryID',
      categories: '++id, name',
      orderID: '++id',
    })
  }
}

export const db = new NavAppDatabase()
