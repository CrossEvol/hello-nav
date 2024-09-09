import React, { useContext } from 'react'
import { defaultIcon } from '../../assets/icons'
import gitHubIcon from '../../assets/images/github.png'
import { AppsContext } from '../../hooks/index'
import { useBearStore } from '../../store'
import './index.less'

function onClickApp(appItem: AppItem) {
  try {
    gtag('event', 'click', {
      event_category: 'App',
      event_label: 'app',
      value: appItem.name,
    })
  } catch (error) {
    console.error(error)
  }
}

function onCornerClick(e: React.SyntheticEvent, appItem: AppItem) {
  e.preventDefault()
  e.stopPropagation()
  try {
    gtag('event', 'click', {
      event_category: 'App',
      event_label: 'app-repo',
      value: appItem.name,
    })
  } catch (err) {
    console.error(err)
  }
  window.open(appItem.repository)
  return false
}

const Cell = (appItem: AppItem & { title: string | undefined; isSettingMode: boolean }) => {
  const toggleFavorite = useBearStore(state => state.toggleNavigationFavorite)
  const moveLeft = useBearStore(state => state.moveLeft)
  const moveRight = useBearStore(state => state.moveRight)
  const { name, icon, homepage, repository, darkInvert, lessRadius, title } = appItem
  const {
    favoriteAppNames,
    hiddenAppNames,
    filterKey,
    /* toggleVisible */
  } = useContext(AppsContext)
  const imgClass = [darkInvert ? 'dark-invert' : '', lessRadius ? 'less-radius' : ''].join(' ')
  const size =
    name.length > 11
      ? name.length > 12
        ? name.length > 13
          ? name.length > 14
            ? 'micro'
            : 'mini'
          : 'tiny'
        : 'small'
      : 'normal'

  const isFavoriteApp =
    (!title || title !== 'favorites') && !appItem.favorite && favoriteAppNames.includes(appItem.name)
  const isHiddenApp = hiddenAppNames.includes(appItem.name)
  // const visible = isHiddenApp ? appItem.isSettingMode : true || isFavoriteApp

  return !isFavoriteApp ? (
    <li className={`cell ${isHiddenApp ? 'hide' : ''} ${appItem.favorite ? 'favorite' : ''}`}>
      <a
        className="app"
        target="_blank"
        href={homepage}
        title={name}
        onClick={() => onClickApp(appItem)}
        rel="noreferrer"
      >
        <div className="img-box">
          <img src={!!icon || icon.length > 0 ? icon : defaultIcon} className={`${imgClass}`} alt={name} />
        </div>
        <p className="title" data-size={size}>
          {name}
        </p>
        {repository && (
          <div onKeyDown={() => {}} onClick={e => onCornerClick(e, appItem)} className="corner">
            <div className="corner-icon-wrap">
              <img className="corner-icon" draggable={false} src={gitHubIcon} alt="" />
            </div>
          </div>
        )}
      </a>
      <div className="app-back">
        <div className="app-setting-head">
          <img src={!!icon || icon.length > 0 ? icon : defaultIcon} className={imgClass} alt={name} />
          <p className="title" data-size={size} title={name}>
            {name}
          </p>
        </div>
        <div className="app-setting-content">
          {/* {!appItem.favorite && (
            <div
              className={`icon ${hiddenAppNames.includes(appItem.name) ? 'icon-hide' : 'icon-show'}`}
              onClick={() => toggleVisible(appItem)}
            ></div>
          )} */}
          {appItem.favorite && !filterKey && (
            <div
              className={`icon icon-left ${appItem.first ? 'disabled' : ''}`}
              onClick={() => moveLeft(appItem.id!)}
            ></div>
          )}
          <div
            className={`icon ${appItem.favorite ? 'icon-favorite-active' : 'icon-favorite'}`}
            onClick={async () => toggleFavorite(appItem.id!)}
          ></div>
          {appItem.favorite && !filterKey && (
            <div
              className={`icon icon-right ${appItem.final ? 'disabled' : ''}`}
              onClick={() => moveRight(appItem.id!)}
            ></div>
          )}
          {/* <div className="icon icon-edit" onClick={() => onEditApp(appItem)}></div> */}
        </div>
      </div>
    </li>
  ) : null
}

export const PlaceholderCell = () => (
  <li className="cell">
    <div className="app-placeholder">
      <span className="icon icon-add"></span>
    </div>
  </li>
)

export default Cell
