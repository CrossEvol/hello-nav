import { useLiveQuery } from 'dexie-react-hooks'
import React, { useCallback, useRef } from 'react'
import { db, setupNavAppDatabase } from '../db'

export const useLibraryFromDexie = () => {
  const flag = useRef(true)
  const categories = useLiveQuery(() => db.categories.toArray(), [])
  const [libraryMap, setLibraryMap] = React.useState<LibraryMap>({ category: [], list: [] })

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
