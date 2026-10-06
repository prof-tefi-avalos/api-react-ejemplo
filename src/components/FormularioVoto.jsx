import { useState } from 'react'
import { enviarVoto } from '../servicios/votos.js'
import Mensaje from './Mensaje.jsx'

function FormularioVoto({ pokemon }) {
  // Formulario controlado: el valor del textarea vive en el estado.
  const [comentario, setComentario] = useState('')

  // Un POST también tiene estados, igual que un GET.
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [votoGuardado, setVotoGuardado] = useState(null)

  // ─── El POST va en el MANEJADOR DEL EVENTO, no en un useEffect ─────────────
  // useEffect es para pedir datos cuando el componente aparece o cambia una
  // dependencia. Un POST responde a una ACCIÓN del usuario (un submit).
  async function manejarEnvio(e) {
    e.preventDefault() // sin esto, el navegador recarga la página al enviar

    setEnviando(true)
    setError(null)
    setVotoGuardado(null)
    try {
      const respuesta = await enviarVoto({ pokemon, comentario: comentario.trim() })
      setVotoGuardado(respuesta)
      setComentario('') // limpiamos el formulario solo si salió bien
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  // Se puede enviar solo si hay un Pokémon elegido, un comentario y no se está
  // enviando otro voto. Es un valor calculado: no necesita estado.
  const puedeEnviar = pokemon && comentario.trim() !== '' && !enviando

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <h2>Votá a tu favorito</h2>

      <label htmlFor="comentario">
        ¿Por qué {pokemon ? <b className="nombre">{pokemon}</b> : 'este Pokémon'}?
      </label>
      <textarea
        id="comentario"
        rows="3"
        placeholder={pokemon ? 'Escribí un comentario…' : 'Primero elegí un Pokémon'}
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        disabled={!pokemon}
      />

      {/* Deshabilitado mientras se envía: si la API tarda y el usuario aprieta
          tres veces, sin esto mandaríamos tres POST. */}
      <button type="submit" disabled={!puedeEnviar}>
        {enviando ? 'Enviando…' : 'Enviar voto'}
      </button>

      {error && <Mensaje tipo="error">😵 {error}</Mensaje>}

      {/* Mostramos lo que DEVOLVIÓ la API (201 Created + el id que asignó). */}
      {votoGuardado && (
        <Mensaje tipo="exito">
          ✅ Voto #{votoGuardado.id} guardado para <b className="nombre">{votoGuardado.pokemon}</b>
        </Mensaje>
      )}
    </form>
  )
}

export default FormularioVoto
