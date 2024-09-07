import { atom, Provider } from 'jotai'
import { type PropsWithChildren } from 'react'

export const TypeAtom = atom<CategoryType>('category')

export const CanDragAtom = atom<boolean>(false)

export default function JotaiProvider({ children }: Readonly<PropsWithChildren>) {
  return <Provider>{children}</Provider>
}
