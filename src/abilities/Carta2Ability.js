export function applyCarta2(state, player, card, options) {
  const { targetCardId } = options;

  if (!targetCardId) {
    throw new Error("Debes seleccionar una carta para proteger.");
  }

  const cardToProtect = player.hand.find(c => c.id === targetCardId) || 
                        player.prisonerPile.find(c => c.id === targetCardId);

  if (cardToProtect) {
    cardToProtect.shields = (cardToProtect.shields || 0) + 1;
    cardToProtect.isProtected = true;
    state.log.push(`${player.name} protegió su carta con un escudo (Carta 2).`);
  }
}