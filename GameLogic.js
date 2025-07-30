const ROWS = 3;
const COLUMNS = 3;

const SYMBOLS_COUNT = { '🍊' : 2, '🍒': 4, '🍋': 6, '🏦': 8 };
const SYMBOLS_VALUES = { '🍊': 5, '🍒': 4, '🍋': 3, '🏦': 2 };

function spin() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) symbols.push(symbol);
  }

  const reels = [];
  for (let i = 0; i < COLUMNS; i++) {
    const reelSymbols = [...symbols];
    reels.push([]);
    for (let j = 0; j < ROWS; j++) {
      const randIndex = Math.floor(Math.random() * reelSymbols.length);
      const selected = reelSymbols[randIndex];
      reels[i].push(selected);
      reelSymbols.splice(randIndex, 1);
    }
  }
  return transpose(reels);
}

function transpose(reels) {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows[i] = [];
    for (let j = 0; j < COLUMNS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
}

function checkWin(rows, lines, bet) {
  let winnings = 0;
  for (let i = 0; i < lines; i++) {
    const line = rows[i];
    if (line.every((s) => s === line[0])) {
      winnings += SYMBOLS_VALUES[line[0]] * bet;
    }
  }
  return winnings;
}

module.exports = { spin, checkWin };
