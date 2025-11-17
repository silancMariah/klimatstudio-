import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Galaxy/GalaxyApp.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
