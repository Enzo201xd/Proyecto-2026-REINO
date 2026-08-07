export function applyCarta9(state, player, card, options) {
  if (player.pile.length === 0) {
    state.log.push(`${player.name} intentó usar un 9, pero su Pila Personal está vacía.`);
    return;
  }

  const drawnCard = player.pile.pop();
  drawnCard.faceUp = true;

  // Verificación de regla de Prisioneros (Reyes Duplicados)
  const isKing = [10, 11, 12].includes(drawnCard.value);
  const hasSameKingInHand = player.hand.some(c => c.value === drawnCard.value);

  if (isKing && hasSameKingInHand) {
    player.prisonerPile.push(drawnCard);
    state.log.push(`${player.name} usó un 9 y robó el Rey ${drawnCard.value}, pero al tener uno igual fue directo a Prisioneros.`);
  } else {
    player.hand.push(drawnCard);
    state.log.push(`${player.name} usó un 9 y robó un ${drawnCard.value} de su Pila Personal hacia su mano.`);
  }
}