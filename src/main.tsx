import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { AppsProvider } from './hooks/index'
import './index.css'
import JotaiProvider from './providers/jotai-provider'
import ModalProvider from './providers/modal-provider'
import { db, type Navigation } from './db'
import nav from './db/libraries.json'

const setupNavAppDatabase = async () => {
  const count = await db.config.count()
  if (count === 0) {
    await db.config.add({ categoryOrderID: 0, navigationOrderID: 0 })
    const res = (await db.config.where({ id: 1 }).toArray())[0]
    let navOrderID = 1
    let cateOrderID = 1
    for (const { title, children: items } of nav.navs) {
      const id = await db.categories.add({ title, order: cateOrderID++, icon: '' })
      if (id) {
        await db.navigations.bulkAdd(
          items.map(item => ({ ...item, categoryID: id, order: navOrderID++ }) as Navigation),
        )
      }
    }
    await db.config.update(1, {
      categoryOrderID: res!.categoryOrderID! + cateOrderID,
      navigationOrderID: res!.navigationOrderID! + navOrderID,
    })
  }
}

/* TODO: how to choose the time to setup database ? or not the BearStore will initial data as never[] */
await setupNavAppDatabase()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppsProvider>
      <JotaiProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </JotaiProvider>
    </AppsProvider>
  </React.StrictMode>,
)
