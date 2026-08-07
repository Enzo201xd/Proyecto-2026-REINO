export function applyCarta1(state, player, card, options) {
  const { targetCardId, targetPlayerId } = options;

  // Caso A: Usar el 1 para deshacerse del 8 (solo 1 vez)
  const curseCard = player.hand.find(c => c.value === 8);
  if (curseCard && targetPlayerId) {
    const targetPlayer = state.players.find(p => p.id === targetPlayerId);
    if (targetPlayer) {
      player.hand = player.hand.filter(c => c.id !== curseCard.id);
      targetPlayer.hand.push(curseCard);
      state.log.push(`${player.name} usó un 1 para pasar la maldición del 8 a ${targetPlayer.name}.`);
      return;
    }
  }

  // Caso B: Reactivar una carta normal de la Pila de Activadas
  if (targetCardId) {
    const targetCard = player.activatedPile.find(c => c.id === targetCardId);
    if (targetCard) {
      state.log.push(`${player.name} usó un 1 para reactivar el efecto de un ${targetCard.value}.`);
    }
  }
}