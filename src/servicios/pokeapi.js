// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE LA POKEAPI (con fetch)
//
// Buena práctica: los componentes NO hacen fetch directo. Todos los pedidos a
// una API viven en un archivo de "servicios". El componente llama a
// obtenerListaPokemon() y no sabe (ni le importa) qué URL hay detrás.
//
// Ventajas:
//   1. Si la API cambia de URL o de versión, se cambia en UN solo lugar.
//   2. Los componentes quedan cortos y se leen fácil.
//   3. Es el lugar ideal para ADAPTAR los datos a la forma que usa nuestra app.
// ════════════════════════════════════════════════════════════════════════════

// La URL base en UNA sola constante. Desarmada:
//   https://   → protocolo (con "s": viaja cifrado; siempre https en los fetch)
//   pokeapi.co → dominio (a qué servidor le pedimos)
//   /api/v2    → ruta base (v2 = versión de la API)
const URL_BASE = 'https://pokeapi.co/api/v2'

const URL_IMAGENES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

// ─── Función auxiliar: hace el GET y revisa la respuesta ─────────────────────
// La escribimos una vez y la reutilizan todas las funciones del servicio.
async function pedirJson(ruta) {
  // Primera espera: fetch devuelve la RESPUESTA (status, ok, headers…),
  // pero todavía no leyó el body. Sin segundo argumento, fetch hace un GET.
  const respuesta = await fetch(`${URL_BASE}${ruta}`)

  // ⚠️ La trampa de fetch: con un 404 o un 500 NO cae en el catch.
  // Para fetch eso también es "una respuesta". Solo rechaza la promesa si NO
  // hubo respuesta (sin internet, servidor apagado, bloqueo de CORS).
  // Por eso revisamos respuesta.ok (true si el status está entre 200 y 299)
  // y tiramos nosotros el error.
  if (!respuesta.ok) {
    const error = new Error(`La PokeAPI respondió con error (${respuesta.status})`)
    error.status = respuesta.status // guardamos el status para decidir el mensaje más arriba
    throw error
  }

  // Segunda espera: convertir el body (que viaja como TEXTO) en un objeto de JS.
  // .json() también devuelve una promesa: si te olvidás este await, tenés una
  // promesa pendiente en lugar de los datos.
  const datos = await respuesta.json()
  return datos
}

// ─── Adaptadores ──────────────────────────────────────────────────────────────
// Convierten lo que manda la API en la forma que necesita NUESTRA app.
// Si mañana cambiamos de API, solo cambian estas funciones: los componentes no
// se enteran.

// Del listado, la API manda: { name: 'pikachu', url: '.../pokemon/25/' }
function adaptarPokemonDeLista(pokemonApi) {
  const id = Number(pokemonApi.url.split('/').filter(Boolean).pop()) // '.../pokemon/25/' → 25
  return {
    id,
    nombre: pokemonApi.name,
    imagen: `${URL_IMAGENES}/${id}.png`,
  }
}

// Del detalle, la API manda cientos de campos. Nos quedamos con los que usamos
// y los pasamos a unidades que entiende cualquiera.
function adaptarPokemon(pokemonApi) {
  return {
    id: pokemonApi.id,
    nombre: pokemonApi.name,
    imagen: pokemonApi.sprites.other['official-artwork'].front_default,
    alturaMetros: pokemonApi.height / 10, // la API usa decímetros (4 → 0.4 m)
    pesoKg: pokemonApi.weight / 10, // la API usa hectogramos (60 → 6 kg)
    tipos: pokemonApi.types.map((t) => t.type.name), // [{ type: { name } }] → ['electric']
  }
}

// ─── Funciones que usan los componentes ──────────────────────────────────────

// GET con query string: "dame `limite` Pokémon, empezando desde `offset`".
export async function obtenerListaPokemon({ limite, offset }) {
  const datos = await pedirJson(`/pokemon?limit=${limite}&offset=${offset}`)

  // La API responde { count, next, previous, results: [...] }
  return {
    pokemones: datos.results.map(adaptarPokemonDeLista),
    hayMas: datos.next !== null, // si no hay "next", estamos en la última página
  }
}

// GET con parámetro de ruta: /pokemon/pikachu
export async function obtenerPokemon(nombre) {
  try {
    const datos = await pedirJson(`/pokemon/${encodeURIComponent(nombre)}`)
    return adaptarPokemon(datos)
  } catch (err) {
    // Traducimos el 404 a un mensaje que entienda el usuario.
    if (err.status === 404) {
      throw new Error(`No existe ningún Pokémon llamado "${nombre}"`)
    }
    throw err // cualquier otro error lo dejamos pasar tal cual
  }
}
