import Dexie, { type Table } from 'dexie'
import { populate } from './populate'

export type Navigation = {
  id?: number
  name: string
  homepage: string
  repository?: string
  icon: string
  keywords?: string[]
  darkInvert?: boolean
  lessRadius?: boolean
  favorite?: boolean
  hidden?: boolean
  first?: boolean
  final?: boolean
  order?: number
  categoryID?: number
  favoriteOrder?: number
}

export type Category = {
  id?: number
  title: string
  icon: string
  order?: number
}

interface Config {
  id?: number
  categoryOrderID?: number
  navigationOrderID?: number
  favoriteOrderID?: number
}

class NavAppDatabase extends Dexie {
  navigations!: Table<Navigation>
  categories!: Table<Category>
  config!: Table<Config>

  constructor() {
    super('NavAppDatabase')

    this.version(1).stores({
      navigations:
        '++id, name, homepage, repository, icon, keywords, darkInvert, lessRadius, favorite, hidden, first, final, order, categoryID',
      categories: '++id, name, order, icon',
      config: '++id, categoryOrderID, navigationOrderID',
    })
  }
}

export const db = new NavAppDatabase()

db.on('populate', populate)

db.on('versionchange', event => {
  console.log(event)
})
