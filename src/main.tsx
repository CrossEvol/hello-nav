import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { setupNavAppDatabase } from './db'
import { AppsProvider } from './hooks/index'
import './index.css'
import JotaiProvider from './providers/jotai-provider'
import ModalProvider from './providers/modal-provider'

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
