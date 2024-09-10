import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { CanDragAtom, ChosenCategoryID, OpenCreateModal } from '../../providers/jotai-provider'
import { useBearStore } from '../../store'
import Cell from '../Cell'
import { SortableItem } from '../Dnd/sortable-item'
import './index.less'

const Contain = (
  list: AppItem[],
  cate: CateItem | null,
  {
    isSettingMode,
    type,
    canDrag,
  }: {
    isSettingMode: boolean
    type: CategoryType
    canDrag: boolean
  },
) => {
  return (
    <ul className="app-list">
      <SortableContext
        items={list.map(item => ({ ...item, id: item.id!.toString() }))}
        strategy={verticalListSortingStrategy}
      >
        {type === 'category' && canDrag
          ? list
              .filter(cell => !!cell.id)
              .map(cell => (
                <SortableItem
                  key={`${cell.homepage}-${cell.categoryID}-${cell.id}`}
                  id={`${cell.categoryID}-${cell.id}-${cell.homepage}`}
                >
                  <Cell
                    {...cell}
                    title={cate?.title}
                    isSettingMode={isSettingMode}
                    key={cell.name + (cell.favorite ? '_fav' : '') + (cell.hidden ? '_hid' : '')}
                  />
                </SortableItem>
              ))
          : list
              .filter(cell => !!cell.id)
              .map(cell => (
                <Cell
                  {...cell}
                  title={cate?.title}
                  isSettingMode={isSettingMode}
                  key={cell.name + (cell.favorite ? '_fav' : '') + (cell.hidden ? '_hid' : '')}
                />
              ))}
      </SortableContext>
      {/* {isSettingMode && cate?.title !== 'favorites' && <PlaceholderCell key="empty" />} */}
    </ul>
  )
}

function ContainWrap({ list: appItems, type, isSettingMode }: ContainWrapProp & { isSettingMode: boolean }) {
  const [, setChosenCategoryID] = useAtom(ChosenCategoryID)
  const [canDrag] = useAtom(CanDragAtom)
  const [, setOpen] = useAtom(OpenCreateModal)
  const [isDragging, setIsDragging] = useState(false)
  const [draggingItem, setDraggingItem] = useState<AppItem | null>(null)
  const swapNavigation = useBearStore(state => state.swapNavigation)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  let contain
  if (type === 'list') {
    contain = Contain(
      // (appItems as CateItem[]).flatMap(cateItem => cateItem.children),
      appItems as AppItem[],
      null,
      { isSettingMode, type, canDrag },
    )
  } else if (type === 'category') {
    contain = (appItems as CateItem[]).reduce((vmList: React.ReactElement[], cate: CateItem) => {
      const { children: apps } = cate
      if (apps.length) {
        vmList.push(
          <div className="category-item" key={cate.title}>
            {cate.id === 0 ? (
              <h2 className="category-item__title" id={cate.title}>
                {cate.title.toUpperCase()}
              </h2>
            ) : (
              <div className="flex items-center justify-center">
                <h2
                  data-tooltip-id={`my-tooltip-create-${cate.id}`}
                  className="category-item__title min-w-2 cursor-pointer"
                  id={cate.title}
                  onClick={() => {
                    setChosenCategoryID(cate.id)
                    setOpen(true)
                  }}
                >
                  {cate.title.toUpperCase()}
                </h2>
              </div>
            )}
            {Contain(apps, cate, { isSettingMode, type, canDrag })}
            <ReactTooltip
              id={`my-tooltip-create-${cate.id}`}
              delayHide={1000}
              place="bottom"
              variant="light"
              content={`+ ${cate.title}`}
            />
          </div>,
        )
      }
      return vmList
    }, [])
  }

  const containClass = ['contain-wrap', type, isSettingMode ? 'reverse' : ''].join(' ')

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const [activeCategoryID, activeID] = (active.id as string).split('-')
    const [overCategoryID, overID] = (over!.id as string).split('-')

    // console.log(active)
    // console.log(over)

    if (active.id !== over!.id) {
      swapNavigation(
        { activeID: Number(activeID), activeCategoryID: Number(activeCategoryID) },
        { overID: Number(overID), overCategoryID: Number(overCategoryID) },
      )
      setIsDragging(false)
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const [activeCateID, activeID] = active.id.toString().split('-')
    setIsDragging(true)
    const newDraggingItem = (appItems as CateItem[])
      .find(cateItem => cateItem.id?.toString() === activeCateID)
      ?.children.find(appItem => appItem.id?.toString() === activeID)
    if (newDraggingItem) {
      setDraggingItem(newDraggingItem)
    } else {
      console.error('can not set dragging item.')
    }
  }

  return (
    <div className={containClass}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {contain}
        <div className="over-lay-lay">
          <DragOverlay>
            {isDragging ? (
              <div className="rounded-lg border-2 border-solid border-purple-800 bg-slate-200">
                <Cell
                  {...draggingItem!}
                  title={draggingItem?.name}
                  isSettingMode={isSettingMode}
                  key={
                    draggingItem?.name + (draggingItem?.favorite ? '_fav' : '') + (draggingItem?.hidden ? '_hid' : '')
                  }
                />
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  )
}

export default ContainWrap
