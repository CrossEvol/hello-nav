import React, { useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { SortableItem } from './sortable-item'

function MultiContainersSort() {
    const [aItems, setAItems] = useState(['1', '2', '3'])
    const [bItems, setBItems] = useState(['a', 'b', 'c'])
    const [isDragging, setIsDragging] = useState(false)
    const [draggingItem, setDraggingItem] = useState<string>('1')
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className='w-96 h-96 flex justify-items-center'>
                <SortableContext
                    items={aItems}
                    strategy={verticalListSortingStrategy}
                >
                    <div className='flex flex-col'>
                        {aItems.map((id) => (
                            <SortableItem key={id} id={id}>
                                <div className='w-20 h-8 border-solid border-2 rounded-lg border-blue-500 m-0.5 text-center font-semibold'>
                                    {id}
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
                <SortableContext
                    items={bItems}
                    strategy={verticalListSortingStrategy}
                >
                    <div className='flex flex-col'>
                        {bItems.map((id) => (
                            <SortableItem key={id} id={id}>
                                <div className='w-20 h-8 border-solid border-2 rounded-lg border-blue-500 m-0.5 text-center font-semibold'>
                                    {id}
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </div>
            <DragOverlay>
                {isDragging ? (
                    <div className='font-bold bg-purple-700 text-white border-dotted border-4 rounded-2xl text-center'>
                        {draggingItem}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (active.id !== over!.id) {
            // in a group
            if (
                aItems.includes(active.id as string) &&
                aItems.includes(over?.id as string)
            ) {
                setAItems((items) => {
                    const oldIndex = items.indexOf(active.id.toString())
                    const newIndex = items.indexOf(over!.id.toString())

                    return arrayMove(items, oldIndex, newIndex)
                })
                return
            }

            // in b group
            if (
                bItems.includes(active.id as string) &&
                bItems.includes(over?.id as string)
            ) {
                setBItems((items) => {
                    const oldIndex = items.indexOf(active.id.toString())
                    const newIndex = items.indexOf(over!.id.toString())

                    return arrayMove(items, oldIndex, newIndex)
                })
                return
            }

            // a -> b
            if (
                aItems.includes(active.id as string) &&
                bItems.includes(over?.id as string)
            ) {
                setAItems(
                    aItems.map((e) =>
                        active.id === e ? (over?.id as string) : e
                    )
                )
                setBItems(
                    bItems.map((e) =>
                        (over?.id as string) === e ? (active.id as string) : e
                    )
                )
                return
            }

            // b -> a
            if (
                bItems.includes(active.id as string) &&
                aItems.includes(over?.id as string)
            ) {
                setAItems(
                    aItems.map((e) =>
                        (over?.id as string) === e ? (active?.id as string) : e
                    )
                )
                setBItems(
                    bItems.map((e) =>
                        active.id === e ? (over?.id as string) : e
                    )
                )
                return
            }
        }
        setIsDragging(false)
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event
        setIsDragging(true)
        setDraggingItem(active.id.toString())
    }
}

export default MultiContainersSort
