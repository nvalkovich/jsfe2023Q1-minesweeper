import storage from './storage.js';
import State from './state.js';

function getRandomNumber(number) {
  return Math.floor(Math.random() * (number - 0 + 1) + 0);
}

function init(size) {
  const grid = [];
  for (let i = 0; i < size; i += 1) {
    const cellsRow = [];
    for (let j = 0; j < size; j += 1) {
      cellsRow.push({ isMine: false, mineCount: 0, state: State.Closed });
    }
    grid.push(cellsRow);
  }

  storage.setGrid(grid);
}

function setMines(minesNum, startX, startY) {
  const grid = storage.getGrid();
  let minesCount = 0;

  while (minesCount < minesNum) {
    const x = getRandomNumber(minesNum);
    const y = getRandomNumber(minesNum);
    const cell = grid[x][y];

    if (!cell.isMine && x !== startX && y !== startY) {
      cell.isMine = true;
      minesCount += 1;
    }
  }

  storage.setGrid(grid);
}

const get = () => storage.getGrid();

export default {
  init,
  setMines,
  get,
};
