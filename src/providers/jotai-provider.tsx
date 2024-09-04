'use client'

import { atom, Provider } from 'jotai'
import { type PropsWithChildren } from 'react'

export const TypeAtom = atom<CategoryType>('category')

export default function JotaiProvider({ children }: Readonly<PropsWithChildren>) {
  return <Provider>{children}</Provider>
}
