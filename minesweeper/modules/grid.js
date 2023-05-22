import storage from './storage.js';
import State from './state.js';

const getRandomNumbers = (size) => {
  const array = [...Array(size).keys()];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const get = () => storage.getGrid();

const getClosestCoordinates = (x, y) => {
  const size = storage.getSize();
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

const setMines = (startY, startX) => {
  const grid = storage.getGrid();
  const size = storage.getSize();
  const minesNum = storage.getMines();
  let minesCount = 0;

  const randomNumbers = getRandomNumbers(size ** 2);
  let index = 0;

  while (minesCount < minesNum) {
    const number = randomNumbers[index];
    const y = Math.trunc(number / size);
    const x = number % size;
    const cell = grid[y][x];

    if (x === startX && y === startY) {
      index += 1;
      // eslint-disable-next-line no-continue
      continue;
    }

    cell.isMine = true;
    minesCount += 1;

    const closest = getClosestCoordinates(x, y);

    for (let i = 0; i < closest.length; i += 1) {
      const [closestX, closestY] = closest[i];
      if (!grid[closestY][closestX].isMine) {
        grid[closestY][closestX].mineCount += 1;
      }
    }

    index += 1;
  }

  storage.setGrid(grid);
};

const showAllMines = (clickedMineX, clickedMineY) => {
  const gridData = storage.getGrid();

  for (let y = 0; y < gridData.length; y += 1) {
    for (let x = 0; x < gridData[y].length; x += 1) {
      const cell = gridData[y][x];
      if (cell.isMine) {
        cell.state = State.Opened;
      }
      if (clickedMineX === x && clickedMineY === y) {
        cell.state = State.ClickedMine;
      }
    }
  }

  storage.setGrid(gridData);
};

const isAllMinesFind = () => {
  const gridData = storage.getGrid();

  for (let y = 0; y < gridData.length; y += 1) {
    for (let x = 0; x < gridData[y].length; x += 1) {
      const cell = gridData[y][x];
      if (cell.state === State.Closed && !cell.isMine) {
        return false;
      }
    }
  }

  return true;
};

const openCell = (x, y) => {
  const gridData = storage.getGrid();
  const cell = gridData[y][x];

  if (cell.state === State.Opened || cell.state === State.Flaged) {
    return;
  }

  if (cell.isMine || cell.mineCount > 0) {
    cell.state = State.Opened;
    storage.setGrid(gridData);
    return;
  }

  if (cell.mineCount === 0) {
    cell.state = State.Opened;
    storage.setGrid(gridData);

    const closest = getClosestCoordinates(x, y);
    for (let i = 0; i < closest.length; i += 1) {
      const [closestX, closestY] = closest[i];
      openCell(closestX, closestY);
    }
  }
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
  setMines,
  get,
  openCell,
  isMine,
  isAllMinesFind,
  setFlag,
  showAllMines,
};
