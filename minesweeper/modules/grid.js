import storage from './storage.js';
import State from './state.js';

function getRandomNumber(number) {
  return Math.floor(Math.random() * ((number - 1) - 0 + 1) + 0);
}

function init(size) {
  const grid = [];
  for (let y = 0; y < size; y += 1) {
    const cellsRow = [];
    for (let x = 0; x < size; x += 1) {
      cellsRow.push({ isMine: false, mineCount: 0, state: State.Closed });
    }
    grid.push(cellsRow);
  }

  storage.setGrid(grid);
}

function setMines(minesNum, startY, startX) {
  const grid = storage.getGrid();
  let minesCount = 0;

  while (minesCount < minesNum) {
    const y = getRandomNumber(minesNum);
    const x = getRandomNumber(minesNum);
    const cell = grid[y][x];

    if (!cell.isMine && x !== startX && y !== startY) {
      cell.isMine = true;
      minesCount += 1;

      if (grid[y - 1] && grid[x + 1] && !grid[y - 1][x + 1].isMine) {
        grid[y - 1][x + 1].mineCount += 1;
      }
      if (grid[y - 1] && !grid[y - 1][x].isMine) {
        grid[y - 1][x].mineCount += 1;
      }
      if (grid[y - 1] && grid[x - 1] && !grid[y - 1][x - 1].isMine) {
        grid[y - 1][x - 1].mineCount += 1;
      }

      if (grid[y] && grid[x + 1] && !grid[y][x + 1].isMine) {
        grid[y][x + 1].mineCount += 1;
      }
      if (grid[y] && grid[x - 1] && !grid[y][x - 1].isMine) {
        grid[y][x - 1].mineCount += 1;
      }

      if (grid[y + 1] && grid[x + 1] && !grid[y + 1][x + 1].isMine) {
        grid[y + 1][x + 1].mineCount += 1;
      }
      if (grid[y + 1] && !grid[y + 1][x].isMine) {
        grid[y + 1][x].mineCount += 1;
      }
      if (grid[y + 1] && grid[x - 1] && !grid[y + 1][x - 1].isMine) {
        grid[y + 1][x - 1].mineCount += 1;
      }
    }
  }
  storage.setGrid(grid);
}

const get = () => storage.getGrid();

function openCell(x, y) {
  const gridData = storage.getGrid();
  gridData[y][x].state = State.Opened;
  storage.setGrid(gridData);
}

function setFlag(isFlaged, x, y) {
  const gridData = storage.getGrid();
  if (!isFlaged) {
    gridData[y][x].state = State.Flaged;
  } else {
    gridData[y][x].state = State.Closed;
  }
  storage.setGrid(gridData);
}

function isMine(x, y) {
  const gridData = storage.getGrid();
  return gridData[y][x].isMine;
}

export default {
  init,
  setMines,
  get,
  openCell,
  isMine,
  setFlag,
};
