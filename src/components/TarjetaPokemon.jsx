// Componente de presentación: no pide datos, solo muestra lo que recibe.
// Recibe el Pokémon YA ADAPTADO por el servicio: { id, nombre, imagen }.
// No sabe nada de la PokeAPI (ni de `name`, ni de `url`).
function TarjetaPokemon({ pokemon, seleccionado, onElegir }) {
  return (
    <button
      type="button"
      className={`tarjeta ${seleccionado ? 'seleccionada' : ''}`}
      onClick={() => onElegir(pokemon.nombre)}
    >
      <span className="numero">#{String(pokemon.id).padStart(3, '0')}</span>
      <img src={pokemon.imagen} alt={pokemon.nombre} width="96" height="96" loading="lazy" />
      <h3 className="nombre">{pokemon.nombre}</h3>
    </button>
  )
}

export default TarjetaPokemon
