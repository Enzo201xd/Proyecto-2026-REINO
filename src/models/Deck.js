export function createDeck() {
  const suits = ['oro', 'copa', 'espada', 'basto'];
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let deck = [];
  let idCounter = 1;

  for (const suit of suits) {
    for (const value of values) {
      deck.push({
        id: `c_${idCounter++}_${suit}_${value}`,
        suit: suit,
        value: value,
        isProtected: false,
        shields: 0,
        faceUp: false
      });
    }
  }

  // (Opcional) Agregar 2 comodines si juegas con ellos
  deck.push({ id: `c_${idCounter++}_comodin_1`, suit: 'comodin', value: 0, isProtected: false, shields: 0, faceUp: false });
  deck.push({ id: `c_${idCounter++}_comodin_2`, suit: 'comodin', value: 0, isProtected: false, shields: 0, faceUp: false });

  return shuffleDeck(deck);
}

function shuffleDeck(deck) {
  let shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}