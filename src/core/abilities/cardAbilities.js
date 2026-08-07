import { applyCarta1 } from './Carta1Ability';
import { applyCarta2 } from './Carta2Ability';
import { applyCarta3 } from './Carta3Ability';
import { applyCarta7 } from './Carta7Ability';
import { applyCarta8 } from './Carta8Ability';
import { applyCarta9 } from './Carta9Ability';

export const SPECIAL_ABILITY_VALUES = [1, 2, 3, 7, 8, 9];

// El Mapa Estratégico de Habilidades (Strategy Pattern)
const abilityRegistry = {
  1: applyCarta1,
  2: applyCarta2,
  3: applyCarta3,
  7: applyCarta7,
  8: applyCarta8,
  9: applyCarta9,
};

/**
 * Ejecuta la habilidad correspondiente a la carta.
 */
export function executeCardAbility(state, card, options = {}) {
  const player = state.players[state.currentPlayerIndex];
  const abilityFn = abilityRegistry[card.value];

  if (!abilityFn) {
    console.warn(`La carta ${card.value} no tiene una habilidad registrada.`);
    return false;
  }

  // Ejecuta la estrategia dinámica
  abilityFn(state, player, card, options);
  return true;
}

/**
 * Helper para el frontend si necesitas mostrar descripciones
 */
export function getAbilityDescription(value) {
  const descriptions = {
    1: "Reactivación o pasar la maldición del 8.",
    2: "Escudo: Protege una carta (acumulable).",
    3: "Intercambia una carta con el rival.",
    7: "Roba del rival o bájate el 8 a activadas.",
    8: "Maldición: Resta 5 puntos, bloquea Reino.",
    9: "Roba de tu Pila Personal directo a la mano."
  };
  return descriptions[value] || "Carta normal.";
}