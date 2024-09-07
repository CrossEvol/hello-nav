import { useLiveQuery } from 'dexie-react-hooks'
import React, { useCallback } from 'react'
import { type Navigation, db } from '../../db'
import nav from '../../db/libraries.json'

const DexieApp = () => {
  const categories = useLiveQuery(() => db.categories.toArray(), [])
  const flag = React.useRef(false)

  const setupNavAppDatabase = async () => {
    const count = await db.orderID.count()
    if (count === 0) {
      let orderID = 1
      for (const { title, children: items } of nav.navs) {
        const id = await db.categories.add({ title })
        if (id) {
          await db.navigations.bulkAdd(items.map(item => ({ ...item, categoryID: id, order: orderID++ }) as Navigation))
          await db.orderID.bulkAdd(items.map(() => ({})))
        }
      }
    }
  }

  const buildLibraryMap = useCallback(async () => {
    if (categories) {
      const obj = Object.create(null)
      for (const category of categories) {
        const res = await db.navigations.where({ categoryID: category.id }).toArray()
        obj[category.title] = res
      }
      console.log(obj)
    }
  }, [categories])

  React.useEffect(() => {
    buildLibraryMap()

    return () => {}
  }, [categories?.length, buildLibraryMap])

  React.useEffect(() => {
    if (flag.current.valueOf()) {
      setupNavAppDatabase()
    }

    return () => {
      flag.current = false
    }
  }, [])

  return <div>DexieApp</div>
}

export default DexieApp
