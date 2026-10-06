import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode: en DESARROLLO, React monta cada componente, lo desmonta y lo
// vuelve a montar. Por eso en la pestaña Red vas a ver cada petición DOS veces.
// Es normal y a propósito (sirve para detectar efectos mal limpiados).
// En producción (npm run build) pasa una sola vez. No lo saques para "arreglarlo".
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
