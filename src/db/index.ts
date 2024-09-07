import Dexie, { type Table } from 'dexie'
import nav from './libraries.json'

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
  icon: string
  order?: number
}

interface Config {
  id?: number
  categoryOrderID?: number
  navigationOrderID?: number
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

export const setupNavAppDatabase = async () => {
  const count = await db.config.count()
  if (count === 0) {
    await db.config.add({ categoryOrderID: 0, navigationOrderID: 0 })
    const res = (await db.config.where({ id: 1 }).toArray())[0]
    let navOrderID = 1
    let cateOrderID = 1
    for (const { title, children: items } of nav.navs) {
      const id = await db.categories.add({ title, order: cateOrderID++, icon: '' })
      if (id) {
        await db.navigations.bulkAdd(
          items.map(item => ({ ...item, categoryID: id, order: navOrderID++ }) as Navigation),
        )
      }
    }
    await db.config.update(1, {
      categoryOrderID: res!.categoryOrderID! + cateOrderID,
      navigationOrderID: res!.navigationOrderID! + navOrderID,
    })
  }
  return (await db.config.count()) > 0
}

export const db = new NavAppDatabase()
