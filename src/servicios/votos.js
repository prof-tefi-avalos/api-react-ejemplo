// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE VOTOS (POST con fetch)
//
// Usamos JSONPlaceholder, una API pública de PRUEBA: acepta el POST y contesta
// 201 Created con lo que le mandamos más un id (siempre 101), aunque no lo
// guarda de verdad. La PokeAPI no sirve para esto: solo acepta GET.
// ════════════════════════════════════════════════════════════════════════════

// URL RELATIVA, sin dominio: el pedido va a nuestro propio servidor de Vite
// (mismo origen → no hay CORS) y el proxy de vite.config.js lo reenvía a
// https://jsonplaceholder.typicode.com. Si acá pusiéramos la URL completa, el
// navegador iría directo a la API y el proxy nunca se usaría.
const URL_VOTOS = '/api-votos/posts'

export async function enviarVoto(voto) {
  // fetch recibe un segundo argumento: un objeto de opciones.
  // En un POST hay TRES cosas que no se pueden olvidar:
  const respuesta = await fetch(URL_VOTOS, {
    // 1. El método. Si no lo ponemos, fetch hace un GET.
    method: 'POST',

    // 2. El header que le avisa a la API que el body es JSON.
    //    Sin esto, muchas APIs no entienden lo que les mandamos.
    headers: { 'Content-Type': 'application/json' },

    // 3. El body. Por la red viaja TEXTO, así que convertimos el objeto con
    //    JSON.stringify. Si mandáramos el objeto directo, llegaría "[object Object]".
    body: JSON.stringify(voto),
  })

  // Igual que en el GET: fetch no rechaza con 400 o 500, lo revisamos nosotros.
  if (!respuesta.ok) {
    throw new Error(`No se pudo enviar el voto (error ${respuesta.status})`)
  }

  // La API devuelve lo que mandamos + el id nuevo: { pokemon, comentario, id: 101 }
  const votoGuardado = await respuesta.json()
  return votoGuardado
}
