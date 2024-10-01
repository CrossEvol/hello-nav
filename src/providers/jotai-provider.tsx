import { Provider, atom } from 'jotai'
import { type PropsWithChildren } from 'react'

export const OpenCreateModal = atom(false)

export const ChosenCategoryID = atom<number | undefined>()

export const TypeAtom = atom<CategoryType>('category')

export type DragState = 'none' | 'swap' | 'insert'

export const CanDragAtom = atom<boolean>(false)

export const DragStateAtom = atom<DragState>('none')

export default function JotaiProvider({ children }: Readonly<PropsWithChildren>) {
  return <Provider>{children}</Provider>
}
