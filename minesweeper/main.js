import grid from './modules/grid.js';
import game from './modules/game.js';
import counters from './modules/counters.js';
import State from './modules/state.js';

const tickHandler = (seconds) => {
  document.querySelector('.timer__state').innerText = seconds;
};

const movesHandler = (moves) => {
  document.querySelector('.moves-counter__state').innerText = moves;
};

const flagsHandler = (flags) => {
  document.querySelector('.flags-counter__state').innerText = flags;
};

const removeGrid = () => {
  const cells = document.querySelectorAll('.grid__cell');
  cells.forEach((cell) => {
    cell.remove();
  });
};

const renderGrid = () => {
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
      } else if (cell.state === State.Flaged) {
        cellElement.setAttribute('flaged', true);
      } else if (cell.state === State.Closed) {
        cellElement.removeAttribute('clicked');
        cellElement.removeAttribute('flaged');
      }
      cellElement.setAttribute('y', y);
      cellElement.setAttribute('x', x);

      gridElement.append(cellElement);
    }
  }
};

const renderPopup = (isWin, seconds, moves) => {
  const body = document.querySelector('body');
  body.className = 'body';
  body.classList.add(isWin ? 'body_colored-win' : 'body_colored-loose');

  const popupWrapper = document.createElement('div');
  popupWrapper.className = 'popup-wrapper popup-wrapper_active';
  document.body.append(popupWrapper);

  const popupContainer = document.createElement('div');
  popupContainer.className = 'popup-container';
  popupWrapper.append(popupContainer);

  const popupContent = document.createElement('div');
  popupContent.className = 'popup-container__content popup-content';
  popupContent.classList.add(isWin ? 'popup-content_win' : 'popup-content_loose');
  popupContainer.append(popupContent);

  const popupMessage = document.createElement('h3');
  popupMessage.className = 'popup-content__message';
  popupContent.append(popupMessage);
  popupMessage.innerText = isWin ? `Hooray! You found all mines in ${seconds} seconds and ${moves} moves!` : 'Game over. Try again';

  const popupImage = document.createElement('div');
  popupImage.className = 'popup-content__img';
  popupContent.append(popupImage);

  const popupBtn = document.createElement('button');
  popupBtn.className = 'popup-content__btn';
  popupContent.append(popupBtn);
  popupBtn.innerText = 'start new game';

  const popupBtnClose = document.createElement('button');
  popupBtnClose.className = 'popup-container__btn popup-btn-close';
  popupContainer.append(popupBtnClose);
};

const renderPage = (gridSize) => {
  const mainContainer = document.createElement('main');
  mainContainer.className = 'main-container';
  document.body.append(mainContainer);

  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid-container';
  mainContainer.append(gridContainer);

  const gridHeader = document.createElement('div');
  gridHeader.className = 'grid-container__header grid-header';
  gridContainer.append(gridHeader);

  const timerElement = document.createElement('div');
  timerElement.className = 'grid-header__timer timer';
  gridHeader.append(timerElement);

  const timerDescription = document.createElement('span');
  timerDescription.className = 'timer__descr';
  timerElement.append(timerDescription);
  timerDescription.innerText = 'timer:';

  const timerState = document.createElement('div');
  timerState.className = 'timer__state';
  timerElement.append(timerState);
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

  const movesCounterElement = document.createElement('div');
  movesCounterElement.className = 'grid-header__moves-counter moves-counter';
  gridHeader.append(movesCounterElement);

  const movesCounterDescription = document.createElement('span');
  movesCounterDescription.className = 'moves-counter__descr';
  movesCounterElement.append(movesCounterDescription);
  movesCounterDescription.innerText = 'moves:';

  const movesCounterState = document.createElement('div');
  movesCounterState.className = 'moves-counter__state';
  movesCounterElement.append(movesCounterState);
  movesCounterState.innerText = '0';

  const gridElement = document.createElement('div');
  gridElement.className = 'grid-container__grid grid';
  gridContainer.append(gridElement);

  renderGrid(gridElement);
};

document.addEventListener('DOMContentLoaded', () => {
  localStorage.clear();
  counters.addTickHandler(tickHandler);
  counters.addMoveHandler(movesHandler);
  counters.addFlagsHandler(flagsHandler);

  const gridSize = 10;
  grid.init(gridSize);
  renderPage(gridSize);

  window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  const gridElement = document.querySelector('.grid');
  gridElement.addEventListener('mousedown', (event) => {
    event.preventDefault();
    const y = +event.target.getAttribute('y');
    const x = +event.target.getAttribute('x');

    if (event.button === 0) {
      if (event.target.getAttribute('flaged')) return;
      game.leftClickHandler(x, y);
    } else if (event.button === 2) {
      if (event.target.getAttribute('clicked')) return;
      const isFlaged = event.target.getAttribute('flaged');
      game.rightClickHandler(isFlaged, x, y);
    }
    renderGrid();
  });
});
