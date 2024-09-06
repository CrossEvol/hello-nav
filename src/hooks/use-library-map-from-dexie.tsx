import { useLiveQuery } from 'dexie-react-hooks'
import React, { useCallback, useRef } from 'react'
import { db, type Navigation } from '../db'
import nav from '../db/libraries.json'

export const useLibraryFromDexie = () => {
  const flag = useRef(true)
  const categories = useLiveQuery(() => db.categories.toArray(), [])
  const [libraryMap, setLibraryMap] = React.useState<LibraryMap>({ category: [], list: [] })

  const setupNavAppDatabase = async () => {
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
  }

  const buildLibraryMap = useCallback(async () => {
    let list = [] as LibraryMap['list']
    if (categories) {
      const arr = [] as LibraryMap['category']
      for (const category of categories) {
        const res = await db.navigations.where({ categoryID: category.id }).toArray()
        arr.push({
          ...category,
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
