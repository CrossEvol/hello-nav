import React from 'react'
import nav from './libraries.json'
import { db, Navigation } from '../../db'
import { useLiveQuery } from 'dexie-react-hooks'

const DexieApp = () => {
  const navigations = useLiveQuery(() => db.navigations.toArray(), [])
  const categories = useLiveQuery(() => db.categories.toArray(), [])
  let flag = true

  const setupNavAppDatabase = async () => {
    const count = await db.orderID.count()
    if (count === 0) {
      let orderID = 1
      for (const { title, children: items } of nav.navs) {
        const id = await db.categories.add({ title })
        if (id) {
          await db.navigations.bulkAdd(items.map(item => ({ ...item, categoryID: id, order: orderID++ }) as Navigation))
          await db.orderID.bulkAdd(items.map(_ => ({})))
        }
      }
    }
  }

  const buildLibraryTree = async () => {
    if (!!categories) {
      const obj = Object.create(null)
      for (const category of categories) {
        const res = await db.navigations.where({ categoryID: category.id }).toArray()
        obj[category.title] = res
      }
      console.log(obj)
    }
  }

  React.useEffect(() => {
    buildLibraryTree()

    return () => {}
  }, [categories?.length])

  React.useEffect(() => {
    if (flag) {
      setupNavAppDatabase()
    }

    return () => {
      flag = false
    }
  }, [])

  return <div>DexieApp</div>
}

export default DexieApp
