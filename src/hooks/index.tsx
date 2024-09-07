import { type PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react'
import { useLibraryFromDexie } from './use-library-map-from-dexie'
import { useLibraryMapFromFile } from './use-library-map-from-file'

const AppsContext = createContext({
  favoriteApps: [] as Array<AppItem>,
  favoriteAppNames: [] as string[],
  setFavoriteApps: (_: Array<AppItem>) => {
    console.log(_)
  },
  toggleFavorite: (_: AppItem) => {
    console.log(_)
  },
  moveLeft: (_: AppItem) => {
    console.log(_)
  },
  moveRight: (_: AppItem) => {
    console.log(_)
  },
  hiddenApps: [] as Array<AppItem>,
  hiddenAppNames: [] as string[],
  setHiddenApps: (_: Array<AppItem>) => {
    console.log(_)
  },
  toggleVisible: (_: AppItem) => {
    console.log(_)
  },
  filterKey: '' as string,
  setFilterKey: (_: string) => {
    console.log(_)
  },
})

/* TODO: if add item to favorites, will result in hiding or the other categories */
const AppsProvider = ({ children }: PropsWithChildren) => {
  // favorite app
  const [favoriteApps, setFavoriteApps] = useState(() => {
    let apps: Array<AppItem> = []
    try {
      apps = JSON.parse(localStorage.getItem('HELLO_NAV_FAVORITE')!) || []
      apps.forEach((a, i) => {
        a.favorite = true
        if (!i) {
          a.first = true
        }
        if (i === apps.length - 1) {
          a.final = true
        }
      })
    } catch (error) {
      console.error(error)
    }
    return apps
  })

  const favoriteAppNames = Array.from(favoriteApps).map(app => app.name)

  useEffect(() => {
    localStorage.setItem('HELLO_NAV_FAVORITE', JSON.stringify(Array.from(favoriteApps)))
  }, [favoriteApps])

  const toggleFavorite = useCallback(
    (app: AppItem) => {
      const apps = Array.from(favoriteApps)
      const index = apps.findIndex(item => item.name === app.name)
      if (index >= 0) {
        apps.splice(index, 1)
      } else {
        apps.push({ ...app, favorite: true })
      }
      apps.forEach((a, i) => {
        delete a.first
        delete a.final
        if (!i) {
          a.first = true
        }
        if (i === apps.length - 1) {
          a.final = true
        }
      })
      setFavoriteApps(apps)
    },
    [favoriteApps],
  )

  const moveLeft = useCallback(
    (app: AppItem) => {
      const apps = Array.from(favoriteApps)
      const index = apps.findIndex(item => item.name === app.name)
      if (index > 0) {
        apps.splice(index, 1)
        apps.splice(index - 1, 0, { ...app })
        apps.forEach((a, i) => {
          delete a.first
          delete a.final
          if (!i) {
            a.first = true
          }
          if (i === apps.length - 1) {
            a.final = true
          }
        })
        setFavoriteApps(apps)
      }
    },
    [favoriteApps],
  )
  const moveRight = useCallback(
    (app: AppItem) => {
      const apps = Array.from(favoriteApps)
      const index = apps.findIndex(item => item.name === app.name)
      if (index < apps.length - 1) {
        apps.splice(index, 1)
        apps.splice(index + 1, 0, { ...app })
        apps.forEach((a, i) => {
          delete a.first
          delete a.final
          if (!i) {
            a.first = true
          }
          if (i === apps.length - 1) {
            a.final = true
          }
        })
        setFavoriteApps(apps)
      }
    },
    [favoriteApps],
  )

  // hidden app
  const [hiddenApps, setHiddenApps] = useState(() => {
    let apps: Array<AppItem> = []
    try {
      apps = JSON.parse(localStorage.getItem('HELLO_NAV_HIDDEN')!) || []
      apps.forEach(a => (a.hidden = true))
    } catch (err) {
      console.error(err)
    }
    return apps
  })

  const hiddenAppNames = Array.from(hiddenApps).map(app => app.name)

  useEffect(() => {
    localStorage.setItem('HELLO_NAV_HIDDEN', JSON.stringify(Array.from(hiddenApps)))
  }, [hiddenApps])

  const toggleVisible = useCallback(
    (app: AppItem) => {
      const list = Array.from(hiddenApps)
      const index = list.findIndex(item => item.name === app.name)
      if (index >= 0) {
        list.splice(index, 1)
      } else {
        list.push({ ...app, hidden: true })
      }
      setHiddenApps(list)
    },
    [hiddenApps],
  )

  const [filterKey, setFilterKey] = useState<string>('')

  const value = {
    favoriteApps,
    favoriteAppNames,
    setFavoriteApps,
    toggleFavorite,
    moveLeft,
    moveRight,
    hiddenApps,
    hiddenAppNames,
    setHiddenApps,
    toggleVisible,
    filterKey,
    setFilterKey,
  }

  return <AppsContext.Provider value={value}>{children}</AppsContext.Provider>
}

export { AppsContext, AppsProvider, useLibraryFromDexie, useLibraryMapFromFile }
