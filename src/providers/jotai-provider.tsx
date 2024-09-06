import { atom, Provider } from 'jotai'
import { type PropsWithChildren } from 'react'

import { db } from '../db'

const navs = await db.navigations.filter(item => item.favorite === true).toArray()

export const FavoritesCategoryAtom = atom<Omit<CateItem, 'title'> & { title: 'favorites' }>({
  id: 0,
  order: 0,
  icon: '',
  title: 'favorites',
  children: navs,
})

export const TypeAtom = atom<CategoryType>('category')

export const CanDragAtom = atom<boolean>(false)

export default function JotaiProvider({ children }: Readonly<PropsWithChildren>) {
  return <Provider>{children}</Provider>
}
