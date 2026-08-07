export function applyCarta3(state, player, card, options) {
  const { myCardId, targetPlayerId, targetCardId } = options;

  const targetPlayer = state.players.find(p => p.id === targetPlayerId);
  if (!targetPlayer) throw new Error("Jugador objetivo no encontrado.");

  const myCardIndex = player.hand.findIndex(c => c.id === myCardId);
  const myCard = player.hand[myCardIndex];

  if (myCard && myCard.value === 8) {
    player.hand.splice(myCardIndex, 1);
    targetPlayer.activatedPile.push(myCard);
    state.log.push(`${player.name} usó un 3 para encajarle su 8 a la Pila de Activadas de ${targetPlayer.name}.`);
    return;
  }

  const targetCardIndex = targetPlayer.hand.findIndex(c => c.id === targetCardId);
  if (targetCardIndex !== -1) {
    const targetCard = targetPlayer.hand[targetCardIndex];

    if (targetCard.isProtected && targetCard.shields > 0) {
      targetCard.shields -= 1;
      if (targetCard.shields === 0) targetCard.isProtected = false;
      state.log.push(`El intercambio falló por el escudo de ${targetPlayer.name}.`);
      return;
    }

    player.hand[myCardIndex] = targetCard;
    targetPlayer.hand[targetCardIndex] = myCard;
    state.log.push(`${player.name} intercambió una carta con ${targetPlayer.name} usando un 3.`);
  }
}