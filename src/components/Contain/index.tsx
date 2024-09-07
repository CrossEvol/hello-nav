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
import { CanDragAtom } from '../../providers/jotai-provider'
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
              .sort((a, b) => a.order! - b.order!)
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
              .sort((a, b) => a.order! - b.order!)
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
  const [canDrag] = useAtom(CanDragAtom)
  const [isDragging, setIsDragging] = useState(false)
  const [draggingItem, setDraggingItem] = useState<AppItem | null>(null)
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
            <h2 className="category-item__title" id={cate.title}>
              {cate.title.toUpperCase()}
            </h2>
            {Contain(apps, cate, { isSettingMode, type, canDrag })}
          </div>,
        )
      }
      return vmList
    }, [])
  }

  const containClass = ['contain-wrap', type, isSettingMode ? 'reverse' : ''].join(' ')

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    // console.log(active)
    // console.log(over)

    if (active.id !== over!.id) {
      const [activeCategoryID, activeID] = (active.id as string).split('-')
      const [overCategoryID, overID] = (over!.id as string).split('-')
      const activeCate = (appItems as CateItem[]).find(item => item.id?.toString() === activeCategoryID)
      const activeItem = activeCate?.children.find(e => e.id?.toString() === activeID)
      const overCate = (appItems as CateItem[]).find(item => (item as CateItem).id?.toString() === overCategoryID)
      const overItem = overCate?.children.find(e => e.id?.toString() === overID)

      const newAppItems =
        activeItem?.category === overItem?.category
          ? (appItems.map(item => {
              const appItem = item as CateItem
              if (appItem.title === activeCate?.title) {
                return {
                  ...appItem,
                  children: appItem.children
                    .map(item => (item.id?.toString() === activeID ? { ...item, order: overItem?.order } : item))
                    .map(item => (item.id?.toString() === overID ? { ...item, order: activeItem?.order } : item))
                    .sort((a, b) => a.order! - b.order!),
                }
              }
              return appItem
            }) as CateItem[])
          : (appItems.map(item => {
              const appItem = item as CateItem
              if (appItem.title === activeCate?.title) {
                return {
                  ...appItem,
                  children: appItem.children
                    .map(item =>
                      item.id?.toString() === activeID
                        ? { ...overItem, id: activeID, order: activeItem?.order, categoryID: activeItem?.categoryID }
                        : item,
                    )
                    .sort((a, b) => a.order! - b.order!),
                }
              }
              if (appItem.title === overCate?.title) {
                return {
                  ...appItem,
                  children: appItem.children
                    .map(item =>
                      item.id?.toString() === overID
                        ? { ...activeItem, id: overID, order: overItem?.order, categoryID: overItem?.categoryID }
                        : item,
                    )
                    .sort((a, b) => a.order! - b.order!),
                }
              }

              return appItem
            }) as CateItem[])
      // setAppItems(newAppItems.sort())
    }
    setIsDragging(false)
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
