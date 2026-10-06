// ════════════════════════════════════════════════════════════════════════════
// EL MISMO SERVICIO, PERO CON AXIOS
//
// Exporta exactamente las mismas funciones que pokeapi.js, con el mismo
// resultado. Para probarlo, en ListaPokemon.jsx y DetallePokemon.jsx cambiá:
//     import { ... } from '../servicios/pokeapi.js'
// por:
//     import { ... } from '../servicios/pokeapi-axios.js'
// Los componentes no cambian NADA: esa es la ventaja de tener una capa de servicios.
//
// Axios es una librería (npm install axios). Comparado con fetch, te ahorra:
//   ✗ el `await respuesta.json()`  → los datos ya vienen en respuesta.data
//   ✗ revisar `respuesta.ok`       → Axios SÍ tira error con status 400 y 500
//   ✗ JSON.stringify y el header Content-Type en los POST
// Y suma: timeout, instancias e interceptores.
// ════════════════════════════════════════════════════════════════════════════
import axios from 'axios'

const URL_IMAGENES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

// Una INSTANCIA: configuración común para todos los pedidos de este servicio.
const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2', // se escribe una sola vez
  timeout: 8000, // si la API tarda más de 8 segundos, el pedido falla
})

// Un INTERCEPTOR de respuestas: corre en TODAS las respuestas antes de que
// lleguen a nuestras funciones. Lo usamos para armar los mensajes de error en
// un solo lugar.
api.interceptors.response.use(
  (respuesta) => respuesta, // si salió bien, la dejamos pasar sin tocarla
  (error) => {
    // error.response existe solo si el servidor contestó (por ejemplo, con un 404)
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Ese Pokémon no existe'))
    }
    if (error.response) {
      return Promise.reject(new Error(`La PokeAPI respondió con error (${error.response.status})`))
    }
    // Sin error.response: no hubo respuesta (sin internet, timeout, CORS…)
    return Promise.reject(new Error('No se pudo conectar con la PokeAPI'))
  },
)

// Los adaptadores son iguales a los de pokeapi.js: no dependen de fetch o Axios.
function adaptarPokemonDeLista(pokemonApi) {
  const id = Number(pokemonApi.url.split('/').filter(Boolean).pop())
  return { id, nombre: pokemonApi.name, imagen: `${URL_IMAGENES}/${id}.png` }
}

function adaptarPokemon(pokemonApi) {
  return {
    id: pokemonApi.id,
    nombre: pokemonApi.name,
    imagen: pokemonApi.sprites.other['official-artwork'].front_default,
    alturaMetros: pokemonApi.height / 10,
    pesoKg: pokemonApi.weight / 10,
    tipos: pokemonApi.types.map((t) => t.type.name),
  }
}

export async function obtenerListaPokemon({ limite, offset }) {
  // Con `params`, Axios arma el query string: ?limit=12&offset=0
  const respuesta = await api.get('/pokemon', { params: { limit: limite, offset } })
  return {
    pokemones: respuesta.data.results.map(adaptarPokemonDeLista),
    hayMas: respuesta.data.next !== null,
  }
}

export async function obtenerPokemon(nombre) {
  const respuesta = await api.get(`/pokemon/${encodeURIComponent(nombre)}`)
  return adaptarPokemon(respuesta.data) // los datos ya vienen convertidos en .data
}
