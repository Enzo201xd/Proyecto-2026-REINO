// src/core/testEngine.js

import { initializeGame, gameEngineReducer, ACTIONS } from './GameEngine.js';

console.log("🔥 INICIANDO EL MOTOR DEL JUEGO 🔥");

// 1. Iniciamos una partida con 2 jugadores
let state = initializeGame(["Enzo", "Dylan"]);
console.log(`Jugador 1: ${state.players[0].name} (Cartas en mano: ${state.players[0].hand.length})`);
console.log(`Jugador 2: ${state.players[1].name} (Cartas en mano: ${state.players[1].hand.length})`);
console.log("Log inicial:", state.log[0]);

// 2. Simulamos el Turno 1 (Ambos jugadores roban a su pila)
console.log("\n--- SIMULANDO TURNO 1 (Robo inicial) ---");
state = gameEngineReducer(state, { type: ACTIONS.DRAW_INITIAL });
state = gameEngineReducer(state, { type: ACTIONS.DRAW_INITIAL });

console.log(`Pila de Enzo: ${state.players[0].pile.length} carta`);
console.log(`Pila de Dylan: ${state.players[1].pile.length} carta`);
console.log("Log:", state.log.slice(-2));

// 3. Empieza el turno 2 normal (Le toca a Enzo de nuevo)
console.log("\n--- TURNO DE ENZO (Robar y Terminar) ---");
state = gameEngineReducer(state, { type: ACTIONS.DRAW_AND_END_TURN });

console.log(`Mano de Enzo: ${state.players[0].hand.length} cartas`);
console.log(`¿A quién le toca ahora?: ${state.players[state.currentPlayerIndex].name}`);
console.log("Log:", state.log.slice(-1)[0]);