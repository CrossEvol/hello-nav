import { db, type Navigation } from './db'
import nav from './libraries.json'

export const setupNavAppDatabase = async () => {
  const count = await db.config.count()
  if (count === 0) {
    await db.config.add({ categoryOrderID: 0, navigationOrderID: 0, favoriteOrderID: 0 })
    const res = (await db.config.where({ id: 1 }).toArray())[0]
    let navOrderID = 1
    let cateOrderID = 1
    for (const { title, children: items } of nav.navs) {
      const id = await db.categories.add({ title, order: cateOrderID++, icon: '' })
      if (id) {
        await db.navigations.bulkAdd(
          items.map(item => ({ ...item, categoryID: id, order: navOrderID++, favoriteOrder: 0 }) as Navigation),
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

export async function populate() {
  await setupNavAppDatabase()
}
