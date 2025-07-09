import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './less/index.less'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
