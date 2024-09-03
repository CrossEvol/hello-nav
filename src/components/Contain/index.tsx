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
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import Cell from '../Cell'
import { SortableItem } from '../Dnd/sortable-item'
import './index.less'

const Contain = (list: AppItem[], cate: CateItem | null, isSettingMode: boolean) => (
  <ul className="app-list">
    <SortableContext items={list} strategy={verticalListSortingStrategy}>
      {list
        .sort((a, b) => a.order! - b.order!)
        .map(cell => (
          <SortableItem key={cell.id} id={cell.id.toString()}>
            <div className="abcdefg">
              <Cell
                {...cell}
                title={cate?.title}
                isSettingMode={isSettingMode}
                key={cell.name + (cell.favorite ? '_fav' : '') + (cell.hidden ? '_hid' : '')}
              />
            </div>
          </SortableItem>
        ))}
    </SortableContext>
    {/* {isSettingMode && cate?.title !== 'favorites' && <PlaceholderCell key="empty" />} */}
  </ul>
)

function ContainWrap({ list, type, isSettingMode }: ContainWrapProp & { isSettingMode: boolean }) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggingItem, setDraggingItem] = useState<string>('1')
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  let contain
  if (type === 'list') {
    contain = Contain(list as AppItem[], null, isSettingMode)
  } else {
    contain = (list as CateItem[]).reduce((vmList: React.ReactElement[], cate: CateItem) => {
      const { children: apps } = cate
      if (apps.length) {
        vmList.push(
          <div className="category-item" key={cate.title}>
            <h2 className="category-item__title" id={cate.title}>
              {cate.title.toUpperCase()}
            </h2>
            {Contain(apps, cate, isSettingMode)}
          </div>,
        )
      }
      return vmList
    }, [])
  }

  const containClass = ['contain-wrap', type, isSettingMode ? 'reverse' : ''].join(' ')

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    console.log(active)
    console.log(over)

    if (active.id !== over!.id) {
    }
    setIsDragging(false)
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    console.log(active)
    setIsDragging(true)
    setDraggingItem(active.id.toString())
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
      </DndContext>
      <DragOverlay>
        {isDragging ? (
          <div className="font-bold bg-purple-700 text-white border-dotted border-4 rounded-2xl text-center">
            {draggingItem}
          </div>
        ) : null}
      </DragOverlay>
    </div>
  )
}

export default ContainWrap
