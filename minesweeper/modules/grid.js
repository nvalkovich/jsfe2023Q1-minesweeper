import storage from './storage.js';
import State from './state.js';

const getRandomNumber = (number) => Math.floor(Math.random() * ((number - 1) - 0 + 1) + 0);

const get = () => storage.getGrid();

const init = (size) => {
  const grid = [];
  for (let y = 0; y < size; y += 1) {
    const cellsRow = [];
    for (let x = 0; x < size; x += 1) {
      cellsRow.push({ isMine: false, mineCount: 0, state: State.Closed });
    }
    grid.push(cellsRow);
  }

  storage.setGrid(grid);
};

const getClosestCoordinates = (x, y) => {
  const size = 10;
  const closestCoordinates = [];

  closestCoordinates.push([x - 1, y - 1]);
  closestCoordinates.push([x - 1, y]);
  closestCoordinates.push([x - 1, y + 1]);

  closestCoordinates.push([x + 1, y - 1]);
  closestCoordinates.push([x + 1, y]);
  closestCoordinates.push([x + 1, y + 1]);

  closestCoordinates.push([x, y - 1]);
  closestCoordinates.push([x, y + 1]);

  return closestCoordinates.filter((coordinate) => coordinate[0] >= 0
    && coordinate[0] < size
    && coordinate[1] >= 0
    && coordinate[1] < size);
};

const isMine = (x, y) => {
  const gridData = storage.getGrid();
  return gridData[y][x].isMine;
};

const setMines = (minesNum, startY, startX) => {
  const grid = storage.getGrid();
  let minesCount = 0;

  while (minesCount < minesNum) {
    const y = getRandomNumber(minesNum);
    const x = getRandomNumber(minesNum);
    const cell = grid[y][x];

    if (!cell.isMine && x !== startX && y !== startY) {
      cell.isMine = true;
      minesCount += 1;

      const closest = getClosestCoordinates(x, y);

      for (let i = 0; i < closest.length; i += 1) {
        const [closestX, closestY] = closest[i];
        if (!grid[closestY][closestX].isMine) {
          grid[closestY][closestX].mineCount += 1;
        }
      }
    }
  }
  storage.setGrid(grid);
};

const openCell = (x, y) => {
  const gridData = storage.getGrid();
  gridData[y][x].state = State.Opened;
  storage.setGrid(gridData);
};

const setFlag = (isFlaged, x, y) => {
  const gridData = storage.getGrid();
  if (!isFlaged) {
    gridData[y][x].state = State.Flaged;
  } else {
    gridData[y][x].state = State.Closed;
  }
  storage.setGrid(gridData);
};

export default {
  init,
  setMines,
  get,
  openCell,
  isMine,
  setFlag,
};
