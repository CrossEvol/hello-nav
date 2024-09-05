import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { AppsProvider } from './hooks/index'
import './index.css'
import JotaiProvider from './providers/jotai-provider'
import ModalProvider from './providers/modal-provider'
// import { Tooltip as ReactTooltip } from 'react-tooltip'

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
