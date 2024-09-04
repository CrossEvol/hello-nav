import libraryTree from '@hello-nav/model'
import React from 'react'
import { transformAppKeyWords } from '../utils'

const useLibraryMapFromFile = () => {
  const [libraryMap] = React.useState({
    category: libraryTree,
    list: libraryTree.reduce((res: AppItem[], item: CateItem) => {
      item.children.forEach(transformAppKeyWords)
      res.push(...item.children)
      return res
    }, []),
  })

  React.useEffect(() => {
    return () => {}
  }, [])

  return libraryMap
}

export { useLibraryMapFromFile }

