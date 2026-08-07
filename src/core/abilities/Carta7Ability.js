export function applyCarta7(state, player, card, options) {
  const { targetPlayerId, targetCardId, selfTargetFor8 } = options;

  if (selfTargetFor8) {
    const curseIndex = player.hand.findIndex(c => c.value === 8);
    if (curseIndex !== -1) {
      const curseCard = player.hand.splice(curseIndex, 1)[0];
      player.activatedPile.push(curseCard);
      state.log.push(`${player.name} usó un 7 para robarse a sí mismo y bajó el 8.`);
    }
    return;
  }

  const targetPlayer = state.players.find(p => p.id === targetPlayerId);
  if (targetPlayer) {
    const targetIndex = targetPlayer.hand.findIndex(c => c.id === targetCardId);
    if (targetIndex !== -1) {
      const stolenCard = targetPlayer.hand[targetIndex];

      if (stolenCard.isProtected && stolenCard.shields > 0) {
        stolenCard.shields -= 1;
        if (stolenCard.shields === 0) stolenCard.isProtected = false;
        state.log.push(`El robo falló por el escudo de ${targetPlayer.name}.`);
        return;
      }

      targetPlayer.hand.splice(targetIndex, 1);
      player.hand.push(stolenCard);
      state.log.push(`${player.name} le robó una carta a ${targetPlayer.name} usando un 7.`);
    }
  }
}