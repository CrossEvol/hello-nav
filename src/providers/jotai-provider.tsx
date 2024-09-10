import { Provider, atom } from 'jotai'
import { type PropsWithChildren } from 'react'

export const OpenCreateModal = atom(false)

export const ChosenCategoryID = atom<number | undefined>()

export const TypeAtom = atom<CategoryType>('category')

export const CanDragAtom = atom<boolean>(false)

export default function JotaiProvider({ children }: Readonly<PropsWithChildren>) {
  return <Provider>{children}</Provider>
}
