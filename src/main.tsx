import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { AppsProvider } from './hooks/index'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppsProvider>
      <App />
    </AppsProvider>
  </React.StrictMode>,
)
