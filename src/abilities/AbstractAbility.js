/**
 * Plantilla base para todas las habilidades del juego.
 * @param {object} state - El estado actual del juego (inmutable).
 * @param {object} player - El jugador que activa la carta.
 * @param {object} card - La carta que se está activando.
 * @param {object} options - Opciones adicionales (objetivos, etc).
 */
export function applyAbility(state, player, card, options) {
  throw new Error("Esta habilidad debe ser implementada por la clase hija.");
}