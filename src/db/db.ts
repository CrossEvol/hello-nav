import Dexie, { type Table } from 'dexie'
import { populate } from './populate'

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
  favoriteOrder: number
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

    /* TODO: did not migrate versions reasonably */
    // this.version(3)
    //   .stores({
    //     navigations:
    //       '++id, name, homepage, repository, icon, keywords, darkInvert, lessRadius, favorite, hidden, first, final, order, categoryID, favoriteOrder',
    //     categories: '++id, name, order, icon',
    //     config: '++id, categoryOrderID, navigationOrderID, favoriteOrderID',
    //   })
    //   .upgrade(tx => {
    //     return tx
    //       .table('config')
    //       .toCollection()
    //       .modify(c => {
    //         c.favoriteOrderID = 0
    //       })
    //   })

    // this.version(2)
    //   .stores({
    //     navigations:
    //       '++id, name, homepage, repository, icon, keywords, darkInvert, lessRadius, favorite, hidden, first, final, order, categoryID, favoriteOrder',
    //     categories: '++id, name, order, icon',
    //     config: '++id, categoryOrderID, navigationOrderID',
    //   })
    //   .upgrade(tx => {
    //     return tx
    //       .table('navigations')
    //       .toCollection()
    //       .modify(navigation => {
    //         navigation.favoriteOrder = 0
    //       })
    //   })

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
