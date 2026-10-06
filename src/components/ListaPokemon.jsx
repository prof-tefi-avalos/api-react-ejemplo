import { useEffect, useState } from 'react'
import { obtenerListaPokemon } from '../servicios/pokeapi.js'
import TarjetaPokemon from './TarjetaPokemon.jsx'
import Mensaje from './Mensaje.jsx'

const POR_PAGINA = 12

function ListaPokemon({ elegido, onElegir }) {
  // ─── Los tres estados de siempre cuando pedimos datos ──────────────────────
  //   pokemones → array vacío: el primer render ocurre ANTES de que lleguen los
  //               datos, y el .map() necesita un array
  //   cargando  → true: apenas se monta el componente, se dispara el pedido
  //   error     → null: todavía no hay error
  const [pokemones, setPokemones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Paginación: desde qué Pokémon empezamos (0, 12, 24…) y si hay más páginas.
  const [offset, setOffset] = useState(0)
  const [hayMas, setHayMas] = useState(false)

  // Lo que el usuario escribe en el buscador (input controlado).
  const [filtro, setFiltro] = useState('')

  // ─── El pedido va adentro de un useEffect ───────────────────────────────────
  // Si el fetch estuviera suelto en el cuerpo del componente, se ejecutaría en
  // CADA render: llegan los datos → set → nuevo render → otro fetch → … infinito.
  // El efecto corre DESPUÉS de que React actualiza el DOM, y el array de
  // dependencias decide cuándo se repite.
  useEffect(() => {
    // La función del useEffect NO puede ser async (una función async devuelve
    // una promesa, y useEffect espera nada o una función de limpieza).
    // Por eso declaramos una función async ADENTRO y la llamamos abajo.
    async function cargarPagina() {
      setCargando(true) // cada vez que cambia la página, volvemos a "cargando"
      setError(null)
      try {
        const resultado = await obtenerListaPokemon({ limite: POR_PAGINA, offset })
        setPokemones(resultado.pokemones)
        setHayMas(resultado.hayMas)
      } catch (err) {
        // Llegamos acá sin internet, con la URL mal escrita, o con el Error
        // que tira el servicio cuando respuesta.ok es false.
        setError(err.message)
      } finally {
        // finally se ejecuta SIEMPRE, salga bien o mal.
        setCargando(false)
      }
    }

    cargarPagina()
  }, [offset])
  // ↑ [offset]: corre al montar y otra vez cada vez que cambia la página.
  //   Regla: en el array va todo lo que el efecto USA y puede cambiar.
  //   (Los botones se deshabilitan mientras carga, así que no se pisan dos pedidos.)

  // El filtro NO necesita estado propio ni otro fetch: se CALCULA en cada render
  // a partir de lo que ya tenemos. Si se puede calcular, no es estado.
  const textoBuscado = filtro.trim().toLowerCase()
  const visibles = pokemones.filter((p) => p.nombre.includes(textoBuscado))

  // ─── Cuatro estados de pantalla: cargando, error, vacío y datos ────────────
  function renderContenido() {
    if (cargando) return <Mensaje>Cargando Pokémon…</Mensaje>
    if (error) return <Mensaje tipo="error">😵 {error}</Mensaje>

    // Vacío: salió todo bien, pero no hay nada para mostrar. No es un error.
    // Comparamos con === 0 (con `visibles.length && …` se vería un 0 en pantalla).
    if (visibles.length === 0) {
      return <Mensaje>No hay Pokémon en esta página que coincidan con "{filtro}".</Mensaje>
    }

    return (
      <div className="grilla">
        {visibles.map((pokemon) => (
          <TarjetaPokemon
            key={pokemon.id}
            pokemon={pokemon}
            seleccionado={pokemon.nombre === elegido}
            onElegir={onElegir}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="lista">
      <input
        className="buscador"
        type="search"
        placeholder="Filtrar esta página por nombre…"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {renderContenido()}

      {/* Los botones solo cambian el estado `offset`. El fetch NO se llama acá:
          lo dispara el useEffect, porque offset está en sus dependencias. */}
      <div className="paginacion">
        <button onClick={() => setOffset(offset - POR_PAGINA)} disabled={offset === 0 || cargando}>
          ← Anterior
        </button>
        <span>Página {offset / POR_PAGINA + 1}</span>
        <button onClick={() => setOffset(offset + POR_PAGINA)} disabled={!hayMas || cargando}>
          Siguiente →
        </button>
      </div>
    </section>
  )
}

export default ListaPokemon
