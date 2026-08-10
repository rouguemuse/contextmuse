import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DealProvider } from './context/DealContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DealProvider>
      <App />
    </DealProvider>
  </React.StrictMode>,
)
