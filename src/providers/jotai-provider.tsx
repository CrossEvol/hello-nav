import { Provider, atom } from 'jotai'
import { type PropsWithChildren } from 'react'

export const TypeAtom = atom<CategoryType>('category')

export const CanDragAtom = atom<boolean>(true)

export default function JotaiProvider({ children }: Readonly<PropsWithChildren>) {
  return <Provider>{children}</Provider>
}
