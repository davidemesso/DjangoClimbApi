import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ClimbAppBar from './components/ClimbAppBar.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ClimbAppBar></ClimbAppBar>
    <App />
  </React.StrictMode>,
)
