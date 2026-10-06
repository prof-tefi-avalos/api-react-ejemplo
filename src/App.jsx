import { useState } from 'react'
import ListaPokemon from './components/ListaPokemon.jsx'
import DetallePokemon from './components/DetallePokemon.jsx'
import FormularioVoto from './components/FormularioVoto.jsx'

// ════════════════════════════════════════════════════════════════════════════
// EJEMPLO CLASE 12 · Llamadas API desde React y useEffect
//
// Qué hay en cada archivo:
//   servicios/pokeapi.js        → GET con fetch, response.ok y adaptadores
//   servicios/pokeapi-axios.js  → el mismo servicio con Axios (instancia + interceptor)
//   servicios/votos.js          → POST con fetch (method, headers, body)
//   vite.config.js              → proxy de desarrollo para evitar CORS
//   components/ListaPokemon     → useEffect con dependencia [offset] y los 4 estados de pantalla
//   components/DetallePokemon   → useEffect con dependencia [nombre] y función de limpieza
//   components/FormularioVoto   → POST en el manejador del evento (NO en un useEffect)
//
// App no pide datos: solo guarda qué Pokémon está elegido y se lo pasa a los
// hijos. Cada componente pide lo que necesita a través de los servicios.
// ════════════════════════════════════════════════════════════════════════════

function App() {
  // El nombre del Pokémon elegido (null = todavía no eligió ninguno).
  // Vive en App porque lo usan DOS hijos: el detalle y el formulario.
  const [elegido, setElegido] = useState(null)

  return (
    <main className="contenido">
      <header>
        <h1>Pokédex</h1>
        <p className="subtitulo">Ejemplo clase 12 · GET, POST, useEffect, Axios y proxy</p>
      </header>

      <div className="columnas">
        <ListaPokemon elegido={elegido} onElegir={setElegido} />

        <aside className="panel-lateral">
          <DetallePokemon nombre={elegido} />
          <FormularioVoto pokemon={elegido} />
        </aside>
      </div>
    </main>
  )
}

export default App
