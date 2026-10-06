# Ejemplo clase 12 · Llamadas API desde React y useEffect

Una Pokédex que pide los datos a la PokeAPI y envía votos a JSONPlaceholder. Usa todos los temas de la clase en una sola app chica, con comentarios en cada archivo.

```bash
npm install
npm run dev        # → http://localhost:5173
```

Necesita Node 20.19+ o 22.12+. Abrí DevTools → **Red** → filtro **Fetch/XHR** para ver cada petición.

## Qué tema está en cada archivo

| Tema | Dónde |
|---|---|
| Capa de servicios, URL base en una constante | `src/servicios/` |
| GET con `fetch`, las dos esperas, `respuesta.ok` | `src/servicios/pokeapi.js` → `pedirJson` |
| Adaptadores (API → forma de nuestra app) | `src/servicios/pokeapi.js` → `adaptarPokemon` |
| Query string y parámetro de ruta | `obtenerListaPokemon` / `obtenerPokemon` |
| `useEffect` con `[offset]` y los tres estados | `src/components/ListaPokemon.jsx` |
| Cuatro estados de pantalla (cargando, error, vacío, datos) | `ListaPokemon.jsx` → `renderContenido` |
| `useEffect` con `[nombre]` y función de limpieza | `src/components/DetallePokemon.jsx` |
| POST con `fetch` (method, headers, `JSON.stringify`) | `src/servicios/votos.js` |
| POST en el manejador del evento, botón deshabilitado | `src/components/FormularioVoto.jsx` |
| Axios: instancia, timeout, interceptor | `src/servicios/pokeapi-axios.js` |
| Proxy de Vite para evitar CORS en desarrollo | `vite.config.js` + URL relativa en `votos.js` |
| StrictMode y la petición doble | `src/main.jsx` |

## Para probar en clase

1. **Petición doble:** recargá con la pestaña Red abierta y vas a ver cada GET dos veces (StrictMode, solo en desarrollo).
2. **Error de red:** en la pestaña Red elegí "Sin conexión" y cambiá de página: aparece el mensaje de error.
3. **Estado vacío:** escribí `zzz` en el buscador.
4. **Proxy:** enviá un voto y mirá en la pestaña Red que la URL es `localhost:5173/api-votos/posts`, no `jsonplaceholder…`. Responde `201` con `id: 101`.
5. **Axios:** en `ListaPokemon.jsx` y `DetallePokemon.jsx` cambiá el import de `pokeapi.js` por `pokeapi-axios.js`. La app funciona igual.
6. **Limpieza:** con la red en "3G lenta", tocá varios Pokémon rápido: el detalle siempre termina mostrando el último que tocaste.

> El proxy funciona solo con `npm run dev`. Con `npm run build` + `npm run preview` el voto falla, porque ya no está el servidor de desarrollo de Vite. Sirve para mostrar en clase que el proxy es solo de desarrollo.
