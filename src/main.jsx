import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

//componente que é renderizado pelo root
createRoot(document.getElementById('root')).render(   
  <StrictMode>
    <App />            
  </StrictMode>
)