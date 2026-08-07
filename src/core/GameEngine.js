import { createDeck } from '../models/Deck.js';
import { executeCardAbility } from '../abilities/cardAbilities.js';

export const ACTIONS = {
  START_GAME: 'START_GAME',
  DRAW_INITIAL: 'DRAW_INITIAL',
  ACTIVATE_CARD: 'ACTIVATE_CARD',
  SWAP_CARD: 'SWAP_CARD', // Intercambio Mano <-> Pila Personal
  DRAW_AND_END_TURN: 'DRAW_AND_END_TURN',
  DECLARE_REINO: 'DECLARE_REINO'
};

export function initializeGame(playerNames) {
  const deck = createDeck();
  const players = playerNames.map((name, index) => ({
    id: `jugador_${index + 1}`,
    name: name,
    hand: [deck.pop(), deck.pop(), deck.pop()],
    pile: [],
    activatedPile: [],
    prisonerPile: [],
    score: 0,
    hasDrawnInitial: false
  }));

  return {
    deck,
    players,
    currentPlayerIndex: 0,
    actionsRemaining: 2,
    turnNumber: 1,
    status: 'PLAYING',
    log: ['La partida ha comenzado. Turno 1: Roben una carta para su pila.']
  };
}

/**
 * Evalúa y envía a prisioneros los reyes duplicados de un mismo número en la mano
 */
function processPrisonerRules(player) {
  const handCopy = [...player.hand];
  const seenKingValues = new Set();
  const validHand = [];

  for (const card of handCopy) {
    if ([10, 11, 12].includes(card.value)) {
      if (seenKingValues.has(card.value)) {
        player.prisonerPile.push(card);
      } else {
        seenKingValues.add(card.value);
        validHand.push(card);
      }
    } else {
      validHand.push(card);
    }
  }
  player.hand = validHand;
}

export function gameEngineReducer(state, action) {
  let newState = JSON.parse(JSON.stringify(state));
  const player = newState.players[newState.currentPlayerIndex];

  switch (action.type) {

    // --- TURNO 1: ROBO INICIAL A LA PILA ---
    case ACTIONS.DRAW_INITIAL:
      if (player.hasDrawnInitial) {
        newState.log.push(`${player.name} ya hizo su robo inicial.`);
        return newState;
      }
      
      const initialCard = newState.deck.pop();
      initialCard.faceUp = false;
      player.pile.push(initialCard);
      player.hasDrawnInitial = true;
      newState.log.push(`${player.name} robó su carta inicial hacia su pila.`);
      
      passTurn(newState);
      return newState;


    // --- ACCIÓN: INTERCAMBIAR CARTA (MANO <-> PILA PERSONAL) ---
    case ACTIONS.SWAP_CARD:
      if (newState.actionsRemaining <= 0) {
        newState.log.push(`A ${player.name} no le quedan acciones en este turno.`);
        return newState;
      }

      const { handCardId, pileCardId } = action.payload;
      const handIndex = player.hand.findIndex(c => c.id === handCardId);
      const pileIndex = player.pile.findIndex(c => c.id === pileCardId);

      if (handIndex === -1 || pileIndex === -1) {
        newState.log.push(`No se encontraron las cartas para el intercambio.`);
        return newState;
      }

      const handCard = player.hand[handIndex];
      // Restricción: La maldición del 8 NO se puede intercambiar con la Pila Personal ni el Mazo
      if (handCard.value === 8) {
        newState.log.push(`${player.name} no puede intercambiar la maldición del 8 con su Pila Personal.`);
        return newState;
      }

      const pileCard = player.pile[pileIndex];
      player.hand[handIndex] = pileCard;
      player.pile[pileIndex] = handCard;

      newState.actionsRemaining -= 1;
      newState.log.push(`${player.name} intercambió una carta de su mano por una de su pila.`);
      
      processPrisonerRules(player);
      return newState;


    // --- ACCIÓN: ACTIVAR HABILIDAD DE CARTA ---
    case ACTIONS.ACTIVATE_CARD:
      if (newState.actionsRemaining <= 0) {
        newState.log.push(`A ${player.name} no le quedan acciones en este turno.`);
        return newState;
      }

      const { card, options } = action.payload;
      const success = executeCardAbility(newState, card, options);
      
      if (success) {
        const hIdx = player.hand.findIndex(c => c.id === card.id);
        if (hIdx !== -1) {
          const playedCard = player.hand.splice(hIdx, 1)[0];
          playedCard.faceUp = true;
          player.activatedPile.push(playedCard);
          
          // Regla: Levantar de la pila personal para mantener mano llena (3 o 4 si tiene el 8)
          const has8 = player.hand.some(c => c.value === 8);
          const targetHandSize = has8 ? 4 : 3;

          if (player.hand.length < targetHandSize && player.pile.length > 0) {
             const replenishment = player.pile.pop();
             replenishment.faceUp = true;
             player.hand.push(replenishment);
             newState.log.push(`${player.name} repuso su mano desde su pila personal.`);
          }
        }
        newState.actionsRemaining -= 1;
      }
      
      processPrisonerRules(player);
      return newState;


    // --- ACCIÓN: ROBAR Y TERMINAR TURNO ---
    case ACTIONS.DRAW_AND_END_TURN:
      if (newState.deck.length === 0) {
        newState.log.push("¡El mazo está vacío! Fin de la partida.");
        newState.status = 'FINISHED';
        return newState;
      }

      const drawnCard = newState.deck.pop();
      drawnCard.faceUp = true;

      // Robo compensatorio: Si le quedaban acciones sin usar, puede cambiar la carta robada con su mano
      if (action.payload?.swapWithHandCardId && newState.actionsRemaining > 0) {
        const replaceIdx = player.hand.findIndex(c => c.id === action.payload.swapWithHandCardId);
        if (replaceIdx !== -1 && player.hand[replaceIdx].value !== 8) {
          const oldCard = player.hand[replaceIdx];
          player.hand[replaceIdx] = drawnCard;
          player.pile.push(oldCard);
          newState.log.push(`${player.name} aprovechó su acción restante para intercambiar la carta robada con su mano.`);
        } else {
          player.hand.push(drawnCard);
        }
      } else {
        player.hand.push(drawnCard);
      }

      newState.log.push(`${player.name} robó del mazo y terminó su turno.`);
      
      processPrisonerRules(player);
      passTurn(newState);
      return newState;


    // --- ACCIÓN: DECLARAR REINO ---
    case ACTIONS.DECLARE_REINO:
      const hasCursed8 = player.hand.some(c => c.value === 8);
      if (hasCursed8) {
        newState.log.push(`${player.name} no puede declarar Reino porque tiene la maldición del 8 en mano.`);
        return newState;
      }

      const kings = player.hand.filter(c => [10, 11, 12].includes(c.value));
      if (kings.length >= 3) {
        const suit = kings[0].suit;
        const allSameSuit = kings.every(k => k.suit === suit && suit !== 'comodin');
        
        if (allSameSuit) {
          newState.status = 'FINISHED';
          player.score += 20;
          newState.log.push(`¡${player.name} HA DECLARADO REINO CON REYES DE ${suit.toUpperCase()}!`);
          return newState;
        }
      }

      newState.log.push(`${player.name} intentó declarar Reino pero sus cartas no cumplen las condiciones.`);
      return newState;

    default:
      return newState;
  }
}

function passTurn(state) {
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  state.actionsRemaining = 2;
  
  if (state.turnNumber === 1 && state.currentPlayerIndex === 0) {
    state.turnNumber = 2;
    state.log.push("=== COMIENZA EL TURNO 2 (Turnos Normales) ===");
  }
}