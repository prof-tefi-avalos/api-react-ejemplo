// Un componente chico para los mensajes de estado ("Cargando…", errores, vacío).
// Así todos se ven igual y no repetimos las clases de CSS en cada lugar.
//   tipo: 'info' (por defecto), 'error' o 'exito'
function Mensaje({ tipo = 'info', children }) {
  // role="alert" hace que los lectores de pantalla anuncien los errores.
  return (
    <p className={`estado ${tipo}`} role={tipo === 'error' ? 'alert' : undefined}>
      {children}
    </p>
  )
}

export default Mensaje
