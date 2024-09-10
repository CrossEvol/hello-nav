import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import CreateModalRoot from './components/Modals/create-modal-root'
import { AppsProvider } from './hooks/index'
import './index.css'
import JotaiProvider from './providers/jotai-provider'
import ModalProvider from './providers/modal-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppsProvider>
      <JotaiProvider>
        <ModalProvider>
          <App />
          <CreateModalRoot />
        </ModalProvider>
      </JotaiProvider>
    </AppsProvider>
  </React.StrictMode>,
)
