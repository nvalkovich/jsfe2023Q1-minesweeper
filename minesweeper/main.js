import grid from './modules/grid.js';
import game from './modules/game.js';
import counters from './modules/counters.js';
import State from './modules/state.js';
import storage from './modules/storage.js';

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

const setDarkTheme = () => {
  const body = document.querySelector('.body');
  const gridElement = document.querySelector('.grid');
  const changeThemeBtn = document.querySelector('.actions__btn_change-theme');
  const gameHeader = document.querySelector('.game-header');
  const gameContainer = document.querySelector('.game-container');

  body.classList.add('body_dark-theme');
  changeThemeBtn.classList.add('actions__btn_dark-theme');
  gameContainer.classList.add('game-container_dark-theme');
  gameHeader.classList.add('game-header_dark-theme');
  gridElement.classList.add('grid_dark-theme');
};

const setLightTheme = () => {
  const body = document.querySelector('.body');
  const gridElement = document.querySelector('.grid');
  const changeThemeBtn = document.querySelector('.actions__btn_change-theme');
  const gameHeader = document.querySelector('.game-header');
  const gameContainer = document.querySelector('.game-container');

  body.classList.remove('body_dark-theme');
  changeThemeBtn.classList.remove('actions__btn_dark-theme');
  gameContainer.classList.remove('game-container_dark-theme');
  gameHeader.classList.remove('game-header_dark-theme');
  gridElement.classList.remove('grid_dark-theme');
};

const playAudio = () => {
  const audioElements = document.getElementsByTagName('audio');
  const toggleAudioMuteBtn = document.querySelector('.actions__btn_mute-audio');

  for (let i = 0; i < audioElements.length; i += 1) {
    audioElements[i].muted = false;
  }

  toggleAudioMuteBtn.classList.add('actions__btn_muted-audio');
};

const muteAudio = () => {
  const audioElements = document.getElementsByTagName('audio');
  const toggleAudioMuteBtn = document.querySelector('.actions__btn_mute-audio');

  for (let i = 0; i < audioElements.length; i += 1) {
    audioElements[i].muted = true;
  }

  toggleAudioMuteBtn.classList.remove('actions__btn_muted-audio');
};

const renderGrid = () => {
  removeGrid();

  const gridElement = document.querySelector('.grid');

  const gridData = grid.get();
  const size = storage.getSize();

  gridElement.classList.remove('grid_size-easy');
  gridElement.classList.remove('grid_size-medium');
  gridElement.classList.remove('grid_size-hard');

  if (size === 10) {
    gridElement.classList.add('grid_size-easy');
  } else if (size === 15) {
    gridElement.classList.add('grid_size-medium');
  } else if (size === 25) {
    gridElement.classList.add('grid_size-hard');
  }

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

const renderResultsPopup = () => {
  const popupWrapper = document.createElement('div');
  popupWrapper.className = 'popup-wrapper popup-wrapper_active';
  document.body.append(popupWrapper);

  const popupContainer = document.createElement('div');
  popupContainer.className = 'popup-container';
  popupWrapper.append(popupContainer);

  const popupContent = document.createElement('div');
  popupContent.className = 'popup-container__content popup-content';
  popupContainer.append(popupContent);

  if (storage.getResults()) {
    const resultsData = storage.getResults();

    const resultListContainer = document.createElement('div');
    resultListContainer.className = 'popup-content__result-list-container';
    popupContent.append(resultListContainer);

    const results = document.createElement('ol');
    results.className = 'popup-content__result-list result-list';
    resultListContainer.append(results);

    for (let i = 0; i < resultsData.length; i += 1) {
      const resultsItem = document.createElement('li');
      resultsItem.className = 'results__item';
      resultsItem.innerText = `You found all ${resultsData[i].mines} mines on size 
        ${resultsData[i].size}x${resultsData[i].size} in ${resultsData[i].time} seconds 
        and ${resultsData[i].moves} moves!`;
      results.append(resultsItem);
    }
  } else {
    const resultMessage = document.createElement('p');
    resultMessage.className = 'popup-content__message popup-content__message_result';
    popupContent.append(resultMessage);
    resultMessage.innerText = "You don't have results yet";
  }

  const popupBtnClose = document.createElement('button');
  popupBtnClose.className = 'popup-container__btn_result popup-btn-close popup-btn-close_result';
  popupContainer.append(popupBtnClose);
};

const renderPopup = (isLoss, time, moves, x, y) => {
  const audioWin = document.querySelector('.audio_win');
  const audioLoss = document.querySelector('.audio_loss');

  if (isLoss) {
    grid.showAllMines(x, y);
    renderGrid();
    audioLoss.play();
  } else {
    storage.saveResults();
    audioWin.play();
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
  popupBtnClose.className = 'popup-container__btn popup-btn-close popup-btn-close_end-game';
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

  const changeThemeBtn = document.createElement('button');
  changeThemeBtn.className = 'actions__btn actions__btn_change-theme';
  gameActions.append(changeThemeBtn);

  const muteAudioBtn = document.createElement('button');
  muteAudioBtn.className = 'actions__btn actions__btn_mute-audio';
  gameActions.append(muteAudioBtn);

  const resultsBtn = document.createElement('button');
  resultsBtn.className = 'actions__btn actions__btn_results';
  gameActions.append(resultsBtn);

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'actions__btn actions__btn_new-game';
  gameActions.append(newGameBtn);
  newGameBtn.innerText = 'New game';

  const setSettingsContainer = document.createElement('div');
  setSettingsContainer.className = 'actions__settings-container';
  gameActions.append(setSettingsContainer);

  const setGridSizeContainer = document.createElement('div');
  setGridSizeContainer.className = 'actions__input-container actions__input-container_size';
  setSettingsContainer.append(setGridSizeContainer);

  const setGridSize = document.createElement('legend');
  setGridSize.className = 'actions__legend actions__legend_size';
  setGridSize.innerText = 'Change size ';
  setGridSizeContainer.append(setGridSize);

  const setEasySizeInput = document.createElement('input');
  setEasySizeInput.className = 'actions__input actions__input_size-easy';
  setEasySizeInput.setAttribute('name', 'size');
  setEasySizeInput.setAttribute('value', '10');
  setEasySizeInput.id = 'size-easy';
  setEasySizeInput.type = 'radio';
  setGridSizeContainer.append(setEasySizeInput);

  const setEasySizeLabel = document.createElement('label');
  setEasySizeLabel.className = 'actions__label actions__label_size-easy';
  setEasySizeLabel.innerText = 'Easy';
  setEasySizeLabel.setAttribute('for', 'size-easy');
  setGridSizeContainer.append(setEasySizeLabel);

  const setMediumSizeInput = document.createElement('input');
  setMediumSizeInput.className = 'actions__input actions__input_size-medium';
  setMediumSizeInput.setAttribute('name', 'size');
  setMediumSizeInput.setAttribute('value', '15');
  setMediumSizeInput.id = 'size-medium';
  setMediumSizeInput.type = 'radio';
  setGridSizeContainer.append(setMediumSizeInput);

  const setMediumSizeLabel = document.createElement('label');
  setMediumSizeLabel.className = 'actions__label actions__label_size-medium';
  setMediumSizeLabel.innerText = 'Medium';
  setMediumSizeLabel.setAttribute('for', 'size-medium');
  setGridSizeContainer.append(setMediumSizeLabel);

  const setHardSizeInput = document.createElement('input');
  setHardSizeInput.className = 'actions__input actions__input_size-hard';
  setHardSizeInput.setAttribute('name', 'size');
  setHardSizeInput.setAttribute('value', '25');
  setHardSizeInput.id = 'size-hard';
  setHardSizeInput.type = 'radio';
  setGridSizeContainer.append(setHardSizeInput);

  const setHardSizeLabel = document.createElement('label');
  setHardSizeLabel.className = 'actions__label actions__label_size-hard';
  setHardSizeLabel.innerText = 'Hard';
  setHardSizeLabel.setAttribute('for', 'size-hard');
  setGridSizeContainer.append(setHardSizeLabel);

  const setMinesNumContainer = document.createElement('div');
  setMinesNumContainer.className = 'actions__input-container  actions__input-container_mines';
  setSettingsContainer.append(setMinesNumContainer);

  const setMinesNumLabel = document.createElement('label');
  setMinesNumLabel.className = 'actions__label actions__label_mines';
  setMinesNumLabel.innerText = 'Change number of mines ';
  setMinesNumLabel.setAttribute('for', 'mines-number');
  setMinesNumContainer.append(setMinesNumLabel);

  const setMinesNumInput = document.createElement('input');
  setMinesNumInput.className = 'actions__input actions__input_mines';
  setMinesNumInput.type = 'number';
  setMinesNumInput.value = storage.getMines();
  setMinesNumInput.setAttribute('name', 'mines-number');
  setMinesNumInput.setAttribute('min', '10');
  setMinesNumInput.setAttribute('max', '99');
  setMinesNumContainer.append(setMinesNumInput);

  const applySettingsBtn = document.createElement('button');
  applySettingsBtn.className = 'actions__settings-btn';
  applySettingsBtn.innerText = 'Apply settings';
  setSettingsContainer.append(applySettingsBtn);

  const audioCLick = document.createElement('audio');
  audioCLick.classList.add('audio_click');
  audioCLick.src = 'assets/audio/click.mp3';
  body.appendChild(audioCLick);

  const audioFlag = document.createElement('audio');
  audioFlag.classList.add('audio_flag');
  audioFlag.src = 'assets/audio/flag.wav';
  body.appendChild(audioFlag);

  const audioWin = document.createElement('audio');
  audioWin.classList.add('audio_win');
  audioWin.src = 'assets/audio/win.wav';
  body.appendChild(audioWin);

  const audioLoss = document.createElement('audio');
  audioLoss.classList.add('audio_loss');
  audioLoss.src = 'assets/audio/loss.mp3';
  body.appendChild(audioLoss);

  renderGrid();
};

document.addEventListener('DOMContentLoaded', () => {
  const isLoaded = storage.loadGame();

  counters.addTickHandler(tickHandler);
  counters.addMoveHandler(movesHandler);
  counters.addFlagsHandler(flagsHandler);
  counters.addMinesHandler(minesHandler);
  game.addGameEndHandler(renderPopup);
  const gridSize = storage.getSize();
  renderPage(gridSize);

  if (isLoaded) {
    tickHandler(storage.getTime());
    movesHandler(storage.getMoves());
    counters.countFlags();
    counters.countMines();
    counters.startTimer();
  }

  const theme = storage.getTheme();
  if (theme === 'dark') {
    setDarkTheme();
  } else {
    setLightTheme();
  }

  const audio = storage.getAudio();
  if (audio === 'play') {
    playAudio();
  } else {
    muteAudio();
  }

  window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  const gridElement = document.querySelector('.grid');
  const audioCLick = document.querySelector('.audio_click');
  const audioFlag = document.querySelector('.audio_flag');

  gridElement.addEventListener('mousedown', (event) => {
    event.preventDefault();
    const y = +event.target.getAttribute('y');
    const x = +event.target.getAttribute('x');

    if (event.button === 0) {
      if (event.target.getAttribute('flaged') || event.target.getAttribute('opened')) return;
      audioCLick.play();
      game.leftClickHandler(x, y);
    } else if (event.button === 2) {
      if (event.target.getAttribute('opened')) return;
      const isFlaged = !!event.target.getAttribute('flaged');
      audioFlag.play();
      game.rightClickHandler(isFlaged, x, y);
    }
    renderGrid();
  });

  const body = document.querySelector('.body');
  const gameHeaderImage = document.querySelector('.game-header__img');

  body.addEventListener('click', (event) => {
    const clickedElement = event.target;
    const popupWrapper = document.querySelector('.popup-wrapper');
    if (clickedElement.classList.contains('popup-btn-close_end-game')) {
      popupWrapper.remove();
      disableCells();
    } else if (clickedElement.classList.contains('popup-btn-close_result')) {
      popupWrapper.remove();
    } else if (clickedElement.classList.contains('popup-content__btn')) {
      game.startNew();
      popupWrapper.remove();
      if (gameHeaderImage.classList.contains('game-header__img_loss')) {
        gameHeaderImage.classList.remove('game-header__img_loss');
      } else if (gameHeaderImage.classList.contains('game-header__img_win')) {
        gameHeaderImage.classList.remove('game-header__img_win');
      }
      renderGrid();
    }
  });

  const startNewGameBtn = document.querySelector('.actions__btn_new-game');

  startNewGameBtn.addEventListener('click', () => {
    game.startNew();
    if (gameHeaderImage.classList.contains('game-header__img_loss')) {
      gameHeaderImage.classList.remove('game-header__img_loss');
    } else if (gameHeaderImage.classList.contains('game-header__img_win')) {
      gameHeaderImage.classList.remove('game-header__img_win');
    }
    renderGrid();
  });

  const changeThemeBtn = document.querySelector('.actions__btn_change-theme');

  changeThemeBtn.addEventListener('click', () => {
    if (storage.getTheme() === 'light') {
      setDarkTheme();
      storage.setTheme('dark');
    } else {
      setLightTheme();
      storage.setTheme('light');
    }
  });

  const toggleAudioMuteBtn = document.querySelector('.actions__btn_mute-audio');

  toggleAudioMuteBtn.addEventListener('click', () => {
    if (storage.getAudio() === 'mute') {
      playAudio();
      storage.setAudio('play');
    } else {
      muteAudio();
      storage.setAudio('mute');
    }
  });

  const resultsBtn = document.querySelector('.actions__btn_results');

  resultsBtn.addEventListener('click', () => {
    renderResultsPopup();
  });

  const saveGameBtn = document.querySelector('.actions__btn_save');

  saveGameBtn.addEventListener('click', () => {
    if (storage.getMoves() > 0) {
      game.save();
    }
  });

  const minesNumberInput = document.querySelector('.actions__input_mines');

  const applySettingsBtn = document.querySelector('.actions__settings-btn');

  applySettingsBtn.addEventListener('click', () => {
    const checkedRadioSize = document.querySelector('input[name="size"]:checked');
    const size = checkedRadioSize ? checkedRadioSize.value : 10;
    storage.setSize(size);

    if (+minesNumberInput.value < 10) {
      minesNumberInput.value = 10;
    } else if (+minesNumberInput.value > 99) {
      minesNumberInput.value = 99;
    }
    storage.setMines(minesNumberInput.value);
    game.startNew(+minesNumberInput.value);
    renderGrid();
  });
});
