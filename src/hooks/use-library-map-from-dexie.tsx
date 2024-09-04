import { useLiveQuery } from 'dexie-react-hooks'
import React, { useCallback, useRef } from 'react'
import { db, type Navigation } from '../db'
import nav from '../db/libraries.json'

export const useLibraryFromDexie = () => {
  const flag = useRef(true)
  const categories = useLiveQuery(() => db.categories.toArray(), [])
  const [libraryMap, setLibraryMap] = React.useState<LibraryMap>({ category: [], list: [] })

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
    let list = [] as LibraryMap['list']
    if (categories) {
      const arr = [] as LibraryMap['category']
      for (const category of categories) {
        const res = await db.navigations.where({ categoryID: category.id }).toArray()
        arr.push({
          id: category.id!,
          title: category.title,
          children: res.map(item => ({ ...item, icon: item.icon, category: category.title })),
        } as CateItem)
        list = list.concat(res)
      }
      // console.log(arr)
      // console.log(list)
      setLibraryMap({ category: arr, list })
    }
  }, [categories, setLibraryMap])

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

  return libraryMap
}
