import { useEffect, useState } from 'react'
import { obtenerPokemon } from '../servicios/pokeapi.js'
import Mensaje from './Mensaje.jsx'

function DetallePokemon({ nombre }) {
  const [pokemon, setPokemon] = useState(null)
  const [cargando, setCargando] = useState(false) // false: si no hay nombre, no se pide nada
  const [error, setError] = useState(null)

  useEffect(() => {
    // Si todavía no eligieron ningún Pokémon, no hay nada que pedir.
    if (!nombre) return

    // ─── Bandera para la limpieza ──────────────────────────────────────────
    // Problema (condición de carrera): el usuario toca Pikachu y enseguida Mew.
    // Salen dos pedidos. Si el de Pikachu llega ÚLTIMO, pisa al de Mew y la
    // pantalla muestra a Pikachu aunque eligió Mew.
    // Solución: antes de volver a ejecutar el efecto con el nombre nuevo, React
    // llama a la función de limpieza del efecto anterior, que pone ignorar = true.
    // Cuando la respuesta vieja llega, los `if (!ignorar)` la descartan.
    // (Existe una versión más completa con AbortController, que directamente
    // CANCELA el pedido.)
    let ignorar = false

    async function cargarDetalle() {
      setCargando(true)
      setError(null)
      try {
        const datos = await obtenerPokemon(nombre)
        if (!ignorar) setPokemon(datos)
      } catch (err) {
        if (!ignorar) setError(err.message)
      } finally {
        if (!ignorar) setCargando(false)
      }
    }

    cargarDetalle()

    // La función que devuelve el efecto es la LIMPIEZA.
    // React la llama antes de repetir el efecto o cuando el componente se desmonta.
    return () => {
      ignorar = true
    }
  }, [nombre])
  // ↑ [nombre]: el efecto USA `nombre`, entonces `nombre` va en el array.
  //   Con [] se pediría solo el primer Pokémon y, al elegir otro, la pantalla
  //   seguiría mostrando el viejo.

  // Los returns anticipados van DESPUÉS de los hooks: los hooks se llaman
  // siempre, en el mismo orden, en el nivel superior del componente.
  if (!nombre) return <Mensaje>👈 Elegí un Pokémon para ver su detalle.</Mensaje>
  if (cargando) return <Mensaje>Buscando a {nombre}…</Mensaje>
  if (error) return <Mensaje tipo="error">😵 {error}</Mensaje>
  if (!pokemon) return null

  return (
    <article className="detalle">
      <img src={pokemon.imagen} alt={pokemon.nombre} width="160" height="160" />
      <h2 className="nombre">
        #{pokemon.id} · {pokemon.nombre}
      </h2>
      <ul className="tipos">
        {pokemon.tipos.map((tipo) => (
          <li key={tipo}>{tipo}</li>
        ))}
      </ul>
      {/* Gracias al adaptador, acá ya usamos metros y kilos (la API manda decímetros y hectogramos). */}
      <p>
        Altura: <b>{pokemon.alturaMetros} m</b> · Peso: <b>{pokemon.pesoKg} kg</b>
      </p>
    </article>
  )
}

export default DetallePokemon
