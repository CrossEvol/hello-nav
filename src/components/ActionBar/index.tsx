import React from 'react'
import { IoCreateOutline } from 'react-icons/io5'
import { SiNginxproxymanager } from 'react-icons/si'
import { TbDatabaseImport, TbPackageExport } from 'react-icons/tb'
import { ReactSVG } from 'react-svg'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import iconCategory from '../../assets/images/icon-category.svg'
import iconClear from '../../assets/images/icon-clear.svg'
import iconList from '../../assets/images/icon-list.svg'
import iconSearch from '../../assets/images/icon-search.svg'
import iconSettingActive from '../../assets/images/icon-setting-active.svg'
import iconSetting from '../../assets/images/icon-setting.svg'
import DrawerApp from '../Drawer/drawer-app'
import CreateModal from '../Modals/create-modal'
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
  const [openCreateModal, setOpenCreateModal] = React.useState(false)
  const [openDrawer, setOpenDrawer] = React.useState(false)

  return (
    <>
      <div className="filter-bar">
        <span className="filter-bar__btn">
          <span
            data-tooltip-id="my-tooltip-create"
            className="filter-bar__toggle-btn text-xl"
            onClick={() => setOpenCreateModal(true)}
            onKeyDown={() => {}}
          >
            <IoCreateOutline />
          </span>
          <span
            data-tooltip-id="my-tooltip-admin"
            className="filter-bar__toggle-btn text-xl"
            onClick={() => setOpenDrawer(true)}
            onKeyDown={() => {}}
          >
            <SiNginxproxymanager />
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
        <ReactTooltip id="my-tooltip-admin" place="bottom" variant="light" content="admin" />
        <ReactTooltip id="my-tooltip-export" place="bottom" variant="light" content="export" />
        <ReactTooltip id="my-tooltip-import" place="bottom" variant="light" content="import" />
        <ReactTooltip id="my-tooltip-1" place="bottom" variant="light" content="theme" />
        <ReactTooltip id="my-tooltip-2" place="bottom" variant="light" content="group" />
        <ReactTooltip id="my-tooltip-3" place="bottom" variant="light" content="setting" />
      </div>
      <DrawerApp open={openDrawer} setOpen={setOpenDrawer} />
      <CreateModal open={openCreateModal} setOpen={setOpenCreateModal} />
    </>
  )
}

export default ActionBar
