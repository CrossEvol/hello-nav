import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { setupNavAppDatabase } from './db'
import { AppsProvider } from './hooks/index'
import './index.css'
import DatabaseProvider from './providers/database-provider'
import JotaiProvider from './providers/jotai-provider'
import ModalProvider from './providers/modal-provider'

await setupNavAppDatabase()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppsProvider>
      <JotaiProvider>
        <ModalProvider>
          <DatabaseProvider>
            <App />
          </DatabaseProvider>
        </ModalProvider>
      </JotaiProvider>
    </AppsProvider>
  </React.StrictMode>,
)
