import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { AppsProvider } from './hooks/index'
import './index.css'
import JotaiProvider from './providers/jotai-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppsProvider>
      <JotaiProvider>
        <App />
      </JotaiProvider>
    </AppsProvider>
  </React.StrictMode>,
)
