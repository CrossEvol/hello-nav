import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import { db, Navigation } from '../../db'
import nav from './libraries.json'

const useLibraryFromDexie = () => {
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
          await db.orderID.bulkAdd(items.map(_ => ({})))
        }
      }
    }
  }

  const buildLibraryMap = async () => {
    let list = [] as LibraryMap['list']
    if (!!categories) {
      const arr = [] as LibraryMap['category']
      for (const category of categories) {
        const res = await db.navigations.where({ categoryID: category.id }).toArray()
        arr.push({
          title: category.title,
          children: res.map(item => ({ ...item, icon: `http://localhost:3333${item.icon}`, category: category.title })),
        })
        list = list.concat(res)
      }
      // console.log(arr)
      // console.log(list)
      setLibraryMap({ category: arr, list })
    }
  }

  React.useEffect(() => {
    buildLibraryMap()

    return () => {}
  }, [categories?.length])

  React.useEffect(() => {
    setupNavAppDatabase()

    return () => {}
  }, [])

  return libraryMap
}

export default useLibraryFromDexie
