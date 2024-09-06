import { useAtom } from 'jotai'
import { useContext, useState } from 'react'
import { AppsContext, useLibraryFromDexie } from '../../hooks/index'
import { FavoritesCategoryAtom, TypeAtom } from '../../providers/jotai-provider'
import { IGNORE_KEYWORD_REG } from '../../utils'
import ActionBar from '../ActionBar'
import ContainWrap from '../Contain'
import Footer from '../Footer'
import Sidebar from '../Sidebar'
import WithError from '../WithError'
import Message from '../WithError/Message'

const ContainWithNotFind = WithError(ContainWrap, Message)

const filterListByKey = (list: AppItem[], key: string) =>
  list.filter(app => (app.keywords as string[]).some(k => k.includes(key)))

const genFilteredByList = (list: (AppItem | CateItem)[], type: CategoryType, filterKey: string) => {
  if (type === 'list') {
    return filterListByKey(list as AppItem[], filterKey)
  }
  return (list as CateItem[]).map(cate => ({
    id: cate.id,
    title: cate.title,
    icon: cate.icon,
    children: filterListByKey(cate.children, filterKey),
  }))
}

function App() {
  const [type, setType] = useAtom(TypeAtom)
  const libraryMap = useLibraryFromDexie()
  const [isSettingMode, setIsSettingMode] = useState(false)
  const { /* favoriteApps */ filterKey, setFilterKey } = useContext(AppsContext)
  const [favoritesCategory] = useAtom(FavoritesCategoryAtom)
  const newFilterKey = filterKey.trim().toLowerCase().replace(IGNORE_KEYWORD_REG, '')
  const libraries: (AppItem | CateItem)[] =
    type === 'category' ? [favoritesCategory, ...libraryMap[type]] : [favoritesCategory, ...libraryMap[type]]

  const filteredLibraries = genFilteredByList(libraries, type, newFilterKey)

  function toggleType() {
    setType(type === 'list' ? 'category' : 'list')
  }

  const resultAppCount =
    type === 'list'
      ? (filteredLibraries as AppItem[]).length
      : (filteredLibraries as CateItem[]).reduce((c, cate) => c + cate.children.length, 0)

  return (
    <div className="body">
      <ActionBar
        filterKey={filterKey}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setFilterKey(e.target.value)}
        onClear={() => setFilterKey('')}
        type={type}
        isSettingMode={isSettingMode}
        toggleType={toggleType}
        toggleSetting={() => setIsSettingMode(!isSettingMode)}
      />
      <div className="main">
        <ContainWithNotFind
          list={filteredLibraries}
          type={type}
          filterKey={filterKey}
          isSettingMode={isSettingMode}
          resultAppCount={resultAppCount}
          isError={!resultAppCount}
        />
      </div>
      {resultAppCount && (
        <Sidebar list={filteredLibraries} type={type} hasFavorite={!!favoritesCategory.children.length} />
      )}
      <Footer />
    </div>
  )
}

export default App
