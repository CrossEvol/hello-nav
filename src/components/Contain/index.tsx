import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import Cell from '../Cell'
import { SortableItem } from '../Dnd/sortable-item'
import './index.less'

const Contain = (list: AppItem[], cate: CateItem | null, isSettingMode: boolean, type: CategoryType) => {
  return (
    <ul className="app-list">
      <SortableContext items={list} strategy={verticalListSortingStrategy}>
        {type === 'category'
          ? list
              .sort((a, b) => a.order! - b.order!)
              .filter(cell => !!cell.id)
              .map(cell => (
                <SortableItem key={`${cell.homepage}-${cell.id}`} id={`${cell.category}-${cell.id}`}>
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

function ContainWrap({ list, type, isSettingMode }: ContainWrapProp & { isSettingMode: boolean }) {
  const [appItems, setAppItems] = useState(list)
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
      (appItems as CateItem[]).flatMap(cateItem => cateItem.children),
      null,
      isSettingMode,
      'list',
    )
  } else {
    contain = (appItems as CateItem[]).reduce((vmList: React.ReactElement[], cate: CateItem) => {
      const { children: apps } = cate
      if (apps.length) {
        vmList.push(
          <div className="category-item" key={cate.title}>
            <h2 className="category-item__title" id={cate.title}>
              {cate.title.toUpperCase()}
            </h2>
            {Contain(apps, cate, isSettingMode, 'category')}
          </div>,
        )
      }
      return vmList
    }, [])
  }

  const containClass = ['contain-wrap', type, isSettingMode ? 'reverse' : ''].join(' ')

  function handleDragEnd(event: DragEndEvent) {
    if (type === 'list') {
      return
    }

    const { active, over } = event

    if (active.id !== over!.id) {
      // console.log(active)
      // console.log(over)
      const [activeCategory, activeID] = (active.id as string).split('-')
      const [overCategory, overID] = (over!.id as string).split('-')
      const activeCate = (appItems as CateItem[]).find(item => item.title === activeCategory)
      const activeItem = activeCate?.children.find(e => e.id.toString() === activeID)
      const overCate = (appItems as CateItem[]).find(item => (item as CateItem).title === overCategory)
      const overItem = overCate?.children.find(e => e.id.toString() === overID)

      const newAppItems =
        activeItem?.category === overItem?.category
          ? (appItems.map(item => {
              const appItem = item as CateItem
              if (appItem.title === activeCate?.title) {
                return {
                  ...appItem,
                  children: appItem.children
                    .map(item => (item.id.toString() === activeID ? { ...item, order: overItem?.order } : item))
                    .map(item => (item.id.toString() === overID ? { ...item, order: activeItem?.order } : item))
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
                      item.id.toString() === activeID
                        ? { ...overItem, id: activeID, order: activeItem?.order, category: activeItem?.category }
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
                      item.id.toString() === overID
                        ? { ...activeItem, id: overID, order: overItem?.order, category: overItem?.category }
                        : item,
                    )
                    .sort((a, b) => a.order! - b.order!),
                }
              }

              return appItem
            }) as CateItem[])
      setAppItems(newAppItems.sort())
    }
    setIsDragging(false)
  }

  function handleDragStart(event: DragStartEvent) {
    if (type === 'list') {
      return
    }

    const { active } = event
    const [activeCate, activeID] = active.id.toString().split('-')
    setIsDragging(true)
    setDraggingItem(
      (appItems as CateItem[])
        .find(cateItem => cateItem.title === activeCate)
        ?.children.find(appItem => appItem.id.toString() === activeID)!,
    )
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
              <div className="border-2 border-solid border-purple-800 rounded-lg bg-slate-200">
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
