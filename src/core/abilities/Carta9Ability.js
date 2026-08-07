export function applyCarta9(state, player, card, options) {
  if (player.pile.length === 0) {
    state.log.push(`${player.name} intentó usar un 9, pero su Pila está vacía.`);
    return;
  }

  const drawnCard = player.pile.pop();
  drawnCard.faceUp = true;
  player.hand.push(drawnCard);
  state.log.push(`${player.name} usó un 9 y robó de su Pila Personal.`);
}