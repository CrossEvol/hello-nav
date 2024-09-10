import { useAtom } from 'jotai'
import React from 'react'
import { HiOutlineEllipsisVertical } from 'react-icons/hi2'
import { IoCreateOutline } from 'react-icons/io5'
import { RiDragDropFill, RiDragDropLine } from 'react-icons/ri'
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
import { useDownload } from '../../hooks'
import { CanDragAtom, OpenCreateModal } from '../../providers/jotai-provider'
import { useBearStore } from '../../store'
import CategoryAgGrid from '../AgGrid/category-ag-grid'
import NavigationAgGrid from '../AgGrid/navigation-ag-grid'
import DrawerApp from '../Drawer/drawer-app'
import PandaBtn from '../PandaBtn'
import PopoverWrapper from '../Popover/popover-wrapper'
import AdminTabsWrapper from '../Tabs/admin-tabs-wrapper'
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
  const exports = useBearStore(state => state.getExports())
  const imports = useBearStore(state => state.imports)
  const { downloadJson } = useDownload()
  const [canDrag, setCanDrag] = useAtom(CanDragAtom)
  const [, setOpen] = useAtom(OpenCreateModal)
  const [openDrawer, setOpenDrawer] = React.useState(false)

  const handleFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.style.display = 'none'

    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = e => {
          const content = e.target?.result
          imports(JSON.parse(content!.toString()))
          // console.log(content)
        }
        reader.readAsText(file)
      }
    }

    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  }

  return (
    <>
      <div className="filter-bar">
        <span className="filter-bar__btn">
          <span
            data-tooltip-id="my-tooltip-create"
            className="filter-bar__toggle-btn text-xl"
            onClick={() => setOpen(true)}
            onKeyDown={() => {}}
          >
            <IoCreateOutline />
          </span>
          <span
            data-tooltip-id="my-tooltip-canDrag"
            className="filter-bar__toggle-btn text-xl"
            onClick={() => setCanDrag(!canDrag)}
            onKeyDown={() => {}}
          >
            {canDrag ? <RiDragDropLine /> : <RiDragDropFill />}
          </span>
          <PopoverWrapper
            triggerElement={
              <span className="filter-bar__toggle-btn text-xl" onClick={() => {}} onKeyDown={() => {}}>
                <HiOutlineEllipsisVertical />
              </span>
            }
            content={
              <div className="m-1 flex flex-row justify-center space-x-2 text-slate-700">
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
                  onClick={() => downloadJson(exports)}
                  onKeyDown={() => {}}
                >
                  <TbPackageExport />
                </span>
                <span
                  data-tooltip-id="my-tooltip-import"
                  className="filter-bar__toggle-btn text-xl"
                  onClick={handleFileUpload}
                  onKeyDown={() => {}}
                >
                  <TbDatabaseImport />
                </span>
              </div>
            }
            position={'below'}
          />
          <PandaBtn />
          <span
            data-tooltip-id="my-tooltip-2"
            className="filter-bar__toggle-btn"
            onClick={toggleType}
            onKeyDown={() => {}}
          >
            <ReactSVG className="icon" src={type === 'list' ? iconList : iconCategory} />
          </span>
          {/* TODO: undefined error when toggle setting */}
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
        <ReactTooltip
          id="my-tooltip-canDrag"
          place="bottom"
          variant="light"
          content={canDrag ? 'CanDrag' : 'CanNotDrag'}
        />
        <ReactTooltip id="my-tooltip-export" place="bottom" variant="light" content="export" />
        <ReactTooltip id="my-tooltip-import" place="bottom" variant="light" content="import" />
        <ReactTooltip id="my-tooltip-1" place="bottom" variant="light" content="theme" />
        <ReactTooltip id="my-tooltip-2" place="bottom" variant="light" content="group" />
        <ReactTooltip id="my-tooltip-3" place="bottom" variant="light" content="setting" />
      </div>
      <DrawerApp
        open={openDrawer}
        setOpen={setOpenDrawer}
        header={<div className="h-8"></div>}
        footer={
          <div className="mx-auto flex max-w-md justify-end gap-6">
            <a
              className="gap-0.25 flex items-center text-xs text-zinc-600"
              href="https://github.com/emilkowalski/vaul"
              target="_self"
            >
              GitHub
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
                aria-hidden="true"
                className="ml-1 size-3 stroke-2"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                <path d="M15 3h6v6"></path>
                <path d="M10 14L21 3"></path>
              </svg>
            </a>
            <a
              className="gap-0.25 flex items-center text-xs text-zinc-600"
              href="https://twitter.com/emilkowalski_"
              target="_self"
            >
              Twitter
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
                aria-hidden="true"
                className="ml-1 size-3"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                <path d="M15 3h6v6"></path>
                <path d="M10 14L21 3"></path>
              </svg>
            </a>
          </div>
        }
      >
        <AdminTabsWrapper
          primaryNode={<NavigationAgGrid />}
          primaryTitle="navigations"
          secondaryNode={<CategoryAgGrid />}
          secondaryTitle="category"
        />
      </DrawerApp>
    </>
  )
}

export default ActionBar
