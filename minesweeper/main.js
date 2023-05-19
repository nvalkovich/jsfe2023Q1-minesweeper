import grid from './modules/grid.js';
import State from './modules/state.js';

function removeGrid() {
  const cells = document.querySelectorAll('.grid__cell');
  cells.forEach((cell) => {
    cell.remove();
  });
}

function renderGrid() {
  removeGrid();

  const gridElement = document.querySelector('.grid');

  const gridData = grid.get();

  for (let y = 0; y < gridData.length; y += 1) {
    for (let x = 0; x < gridData[y].length; x += 1) {
      const cell = gridData[y][x];
      const cellElement = document.createElement('div');
      cellElement.className = 'grid__cell';
      if (cell.isMine) {
        cellElement.setAttribute('is-mine', true);
      } else if (!cell.isMine && cell.mineCount > 0) {
        cellElement.innerText = cell.state === State.Opened ? `${cell.mineCount}` : '';
        cellElement.setAttribute('is-number', true);
        cellElement.setAttribute('number', `${cell.mineCount}`);
      } else {
        cellElement.setAttribute('empty', true);
      }

      if (cell.state === State.Opened) {
        cellElement.setAttribute('clicked', true);
      }

      cellElement.setAttribute('y', y);
      cellElement.setAttribute('x', x);

      gridElement.append(cellElement);
    }
  }
}

function renderPage(gridSize) {
  const mainContainer = document.createElement('main');
  mainContainer.className = 'main-container';
  document.body.append(mainContainer);

  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid-container';
  mainContainer.append(gridContainer);

  const gridHeader = document.createElement('div');
  gridHeader.className = 'grid-container__header grid-header';
  gridContainer.append(gridHeader);

  const timer = document.createElement('div');
  timer.className = 'grid-header__timer timer';
  gridHeader.append(timer);

  const timerDescription = document.createElement('span');
  timerDescription.className = 'timer__descr';
  timer.append(timerDescription);
  timerDescription.innerText = 'timer:';

  const timerState = document.createElement('div');
  timerState.className = 'timer__state';
  timer.append(timerState);
  timerState.innerText = '0';

  const flagsCounter = document.createElement('div');
  flagsCounter.className = 'grid-header__flags-counter flags-counter';
  gridHeader.append(flagsCounter);

  const flagsCounterIcon = document.createElement('div');
  flagsCounterIcon.className = 'flags-counter__icon';
  flagsCounter.append(flagsCounterIcon);

  const flagsCounterState = document.createElement('span');
  flagsCounterState.className = 'flags-counter__state';
  flagsCounter.append(flagsCounterState);
  flagsCounterState.innerText = '0';

  const gridHeaderTitle = document.createElement('h2');
  gridHeaderTitle.className = 'grid-header__title';
  gridHeader.append(gridHeaderTitle);
  gridHeaderTitle.innerText = 'Minesweeper';

  const minesCounter = document.createElement('div');
  minesCounter.className = 'grid-header__mines-counter mines-counter';
  gridHeader.append(minesCounter);

  const minesCounterIcon = document.createElement('div');
  minesCounterIcon.className = 'mines-counter__icon';
  minesCounter.append(minesCounterIcon);

  const minesCounterState = document.createElement('span');
  minesCounterState.className = 'mines-counter__state';
  minesCounter.append(minesCounterState);
  minesCounterState.innerText = gridSize;

  const movesCounter = document.createElement('div');
  movesCounter.className = 'grid-header__moves-counter moves-counter';
  gridHeader.append(movesCounter);

  const movesCounterDescription = document.createElement('span');
  movesCounterDescription.className = 'moves-counter__descr';
  movesCounter.append(movesCounterDescription);
  movesCounterDescription.innerText = 'moves:';

  const movesCounterState = document.createElement('div');
  movesCounterState.className = 'moves-counter__state';
  movesCounter.append(movesCounterState);
  movesCounterState.innerText = '0';

  const gridElement = document.createElement('div');
  gridElement.className = 'grid-container__grid grid';
  gridContainer.append(gridElement);

  renderGrid(gridElement);
}

document.addEventListener('DOMContentLoaded', () => {
  const gridSize = 10;
  grid.init(gridSize);
  renderPage(gridSize);
  let isGameStarted = false;

  const gridElement = document.querySelector('.grid');
  gridElement.addEventListener('click', (event) => {
    const y = +event.target.getAttribute('y');
    const x = +event.target.getAttribute('x');
    if (!isGameStarted) {
      grid.setMines(gridSize, y, x);
      grid.openCell(y, x);
      renderGrid();
      isGameStarted = true;
    } else {
      grid.openCell(y, x);
      renderGrid();
    }
  });
});
