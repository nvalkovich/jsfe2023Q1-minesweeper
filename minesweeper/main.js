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

const minesHandler = (mines) => {
  document.querySelector('.mines-counter__state').innerText = mines;
};

const removeGrid = () => {
  const cells = document.querySelectorAll('.grid__cell');
  cells.forEach((cell) => {
    cell.remove();
  });
};

const disableCells = () => {
  const cells = document.querySelectorAll('.grid__cell');
  for (let i = 0; i < cells.length; i += 1) {
    cells[i].disabled = true;
  }
};

const renderGrid = () => {
  removeGrid();

  const gridElement = document.querySelector('.grid');

  const gridData = grid.get();

  for (let y = 0; y < gridData.length; y += 1) {
    for (let x = 0; x < gridData[y].length; x += 1) {
      const cell = gridData[y][x];
      const cellElement = document.createElement('button');
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
        cellElement.setAttribute('opened', true);
      } else if (cell.state === State.Flaged) {
        cellElement.setAttribute('flaged', true);
      } else if (cell.state === State.Closed) {
        cellElement.removeAttribute('opened');
        cellElement.removeAttribute('flaged');
      } else {
        cellElement.setAttribute('clicked-mine', true);
      }

      cellElement.setAttribute('y', y);
      cellElement.setAttribute('x', x);

      gridElement.append(cellElement);
    }
  }
};

const renderPopup = (isLoss, time, moves, x, y) => {
  if (isLoss) {
    grid.showAllMines(x, y);
    renderGrid();
  }

  const gameHeaderImage = document.querySelector('.game-header__img');
  gameHeaderImage.classList.add(isLoss ? 'game-header__img_loss' : 'game-header__img_win');

  const popupWrapper = document.createElement('div');
  popupWrapper.className = 'popup-wrapper popup-wrapper_active';
  document.body.append(popupWrapper);

  const popupContainer = document.createElement('div');
  popupContainer.className = 'popup-container';
  popupWrapper.append(popupContainer);

  const popupContent = document.createElement('div');
  popupContent.className = 'popup-container__content popup-content';
  popupContent.classList.add(isLoss ? 'popup-content_loss' : 'popup-content_win');
  popupContainer.append(popupContent);

  const popupMessage = document.createElement('h3');
  popupMessage.className = 'popup-content__message';
  popupContent.append(popupMessage);
  popupMessage.innerText = isLoss
    ? 'Game over. Try again'
    : `Hooray! You found all mines in ${time} seconds and ${moves} moves!`;

  const popupImage = document.createElement('div');
  popupImage.className = 'popup-content__img';
  popupContent.append(popupImage);

  const popupBtn = document.createElement('button');
  popupBtn.className = 'popup-content__btn';
  popupContent.append(popupBtn);
  popupBtn.innerText = 'Start new game';

  const popupBtnClose = document.createElement('button');
  popupBtnClose.className = 'popup-container__btn popup-btn-close';
  popupContainer.append(popupBtnClose);
};

const renderPage = (gridSize) => {
  const body = document.querySelector('body');
  body.className = 'body';

  const mainContainer = document.createElement('main');
  mainContainer.className = 'main-container';
  document.body.append(mainContainer);

  const gameContainer = document.createElement('div');
  gameContainer.className = 'game-container';
  mainContainer.append(gameContainer);

  const gameHeader = document.createElement('div');
  gameHeader.className = 'game-container__header game-header';
  gameContainer.append(gameHeader);

  const timerElement = document.createElement('div');
  timerElement.className = 'game-header__timer timer';
  gameHeader.append(timerElement);

  const timerDescription = document.createElement('span');
  timerDescription.className = 'timer__descr';
  timerElement.append(timerDescription);
  timerDescription.innerText = 'timer:';

  const timerState = document.createElement('div');
  timerState.className = 'timer__state';
  timerElement.append(timerState);
  timerState.innerText = '0';

  const flagsCounter = document.createElement('div');
  flagsCounter.className = 'game-header__flags-counter flags-counter';
  gameHeader.append(flagsCounter);

  const flagsCounterIcon = document.createElement('div');
  flagsCounterIcon.className = 'flags-counter__icon';
  flagsCounter.append(flagsCounterIcon);

  const flagsCounterState = document.createElement('span');
  flagsCounterState.className = 'flags-counter__state';
  flagsCounter.append(flagsCounterState);
  flagsCounterState.innerText = '0';

  const gameHeaderImage = document.createElement('div');
  gameHeaderImage.className = 'game-header__img';
  gameHeader.append(gameHeaderImage);

  const minesCounter = document.createElement('div');
  minesCounter.className = 'game-header__mines-counter mines-counter';
  gameHeader.append(minesCounter);

  const minesCounterIcon = document.createElement('div');
  minesCounterIcon.className = 'mines-counter__icon';
  minesCounter.append(minesCounterIcon);

  const minesCounterState = document.createElement('span');
  minesCounterState.className = 'mines-counter__state';
  minesCounter.append(minesCounterState);
  minesCounterState.innerText = gridSize;

  const movesCounterElement = document.createElement('div');
  movesCounterElement.className = 'game-header__moves-counter moves-counter';
  gameHeader.append(movesCounterElement);

  const movesCounterDescription = document.createElement('span');
  movesCounterDescription.className = 'moves-counter__descr';
  movesCounterElement.append(movesCounterDescription);
  movesCounterDescription.innerText = 'moves:';

  const movesCounterState = document.createElement('div');
  movesCounterState.className = 'moves-counter__state';
  movesCounterElement.append(movesCounterState);
  movesCounterState.innerText = '0';

  const gameField = document.createElement('div');
  gameField.className = 'game-container__game-field game-field';
  gameContainer.append(gameField);

  const gridElement = document.createElement('div');
  gridElement.className = 'game-field__grid grid';
  gameField.append(gridElement);

  const gameActions = document.createElement('div');
  gameActions.className = 'game-container__actions game-actions';
  gameContainer.append(gameActions);

  const saveProgressBtn = document.createElement('button');
  saveProgressBtn.className = 'actions__btn actions__btn_save';
  gameActions.append(saveProgressBtn);
  saveProgressBtn.innerText = 'Save progress';

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'actions__btn actions__btn_new-game';
  gameActions.append(newGameBtn);
  newGameBtn.innerText = 'New game';
  renderGrid();
};

document.addEventListener('DOMContentLoaded', () => {
  localStorage.clear();
  counters.addTickHandler(tickHandler);
  counters.addMoveHandler(movesHandler);
  counters.addFlagsHandler(flagsHandler);
  counters.addMinesHandler(minesHandler);

  const gridSize = 10;
  const defaultMinesNum = 10;
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
      const isMine = event.target.getAttribute('is-mine');
      if (isMine) {
        game.addGameEndHandler(renderPopup);
      }
      game.leftClickHandler(defaultMinesNum, x, y);
    } else if (event.button === 2) {
      if (event.target.getAttribute('opened')) return;
      const isFlaged = event.target.getAttribute('flaged');
      game.rightClickHandler(isFlaged, x, y);
    }
    renderGrid();
  });

  const body = document.querySelector('.body');
  body.addEventListener('click', (event) => {
    const clickedElement = event.target;
    const popupWrapper = document.querySelector('.popup-wrapper');
    if (clickedElement.classList.contains('popup-btn-close')) {
      popupWrapper.remove();
      disableCells();
    } else if (clickedElement.classList.contains('popup-content__btn')) {
      game.startNew(defaultMinesNum);
      popupWrapper.remove();
      renderGrid();
    }
  });

  const startNewGameBtn = document.querySelector('.actions__btn_new-game');

  startNewGameBtn.addEventListener('click', () => {
    game.startNew(defaultMinesNum);
    renderGrid();
  });
});
