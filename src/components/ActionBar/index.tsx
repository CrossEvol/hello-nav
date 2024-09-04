import { ReactSVG } from 'react-svg'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import iconCategory from '../../assets/images/icon-category.svg'
import iconClear from '../../assets/images/icon-clear.svg'
import iconList from '../../assets/images/icon-list.svg'
import iconSearch from '../../assets/images/icon-search.svg'
import iconSettingActive from '../../assets/images/icon-setting-active.svg'
import iconSetting from '../../assets/images/icon-setting.svg'
import { IoCreateOutline } from 'react-icons/io5'
import { TbPackageExport } from 'react-icons/tb'
import { TbDatabaseImport } from 'react-icons/tb'
import PandaBtn from '../PandaBtn'
import './index.less'

function ActionBar({
  filterKey,
  type,
  toggleType,
  toggleSetting,
  onInput,
  onClear,
  isSettingMode,
}: FilterProps & { isSettingMode: boolean }) {
  return (
    <>
      <div className="filter-bar">
        <span className="filter-bar__btn">
          <span
            data-tooltip-id="my-tooltip-create"
            className="filter-bar__toggle-btn text-xl"
            onClick={() => alert('1')}
            onKeyDown={() => {}}
          >
            <IoCreateOutline />
          </span>
          <span
            data-tooltip-id="my-tooltip-export"
            className="filter-bar__toggle-btn text-xl"
            onClick={() => alert('2')}
            onKeyDown={() => {}}
          >
            <TbPackageExport />
          </span>
          <span
            data-tooltip-id="my-tooltip-import"
            className="filter-bar__toggle-btn text-xl"
            onClick={() => alert('3')}
            onKeyDown={() => {}}
          >
            <TbDatabaseImport />
          </span>
          <PandaBtn />
          <span
            data-tooltip-id="my-tooltip-2"
            className="filter-bar__toggle-btn"
            onClick={toggleType}
            onKeyDown={() => {}}
          >
            <ReactSVG className="icon" src={type === 'list' ? iconList : iconCategory} />
          </span>
          <span
            data-tooltip-id="my-tooltip-3"
            className="filter-bar__toggle-btn"
            onClick={toggleSetting}
            onKeyDown={() => {}}
          >
            <ReactSVG className="icon setting-icon" src={isSettingMode ? iconSettingActive : iconSetting} />
          </span>
        </span>
        <span className="filter-bar__input-warp">
          <input
            aria-label="filterIpt"
            className="search-input"
            type="text"
            value={filterKey}
            onChange={() => {}}
            onInput={onInput}
          />
          <div className="input-icon-wrap">
            <ReactSVG className="icon search-icon" src={iconSearch} />
            <ReactSVG className="icon clear-icon" src={iconClear} onClick={onClear} />
          </div>
        </span>
        <ReactTooltip id="my-tooltip-create" place="bottom" variant="light" content="create" />
        <ReactTooltip id="my-tooltip-export" place="bottom" variant="light" content="export" />
        <ReactTooltip id="my-tooltip-import" place="bottom" variant="light" content="import" />
        <ReactTooltip id="my-tooltip-1" place="bottom" variant="light" content="theme" />
        <ReactTooltip id="my-tooltip-2" place="bottom" variant="light" content="group" />
        <ReactTooltip id="my-tooltip-3" place="bottom" variant="light" content="setting" />
      </div>
    </>
  )
}

export default ActionBar
