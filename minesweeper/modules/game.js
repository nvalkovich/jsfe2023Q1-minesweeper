import grid from './grid.js';
import counters from './counters.js';
import storage from './storage.js';

let gameEndCallback = null;

const startNew = (defaultMinesNum) => {
  storage.removeGame();
  storage.loadGame();
  counters.reset(defaultMinesNum);
  storage.setIsStarted(false);
};

const leftClickHandler = (defaultMinesNum, x, y) => {
  if (!storage.getIsStarted()) {
    startNew(defaultMinesNum);
    grid.setMines(10, y, x);
    counters.startTimer();
    storage.setIsStarted(true);
  }

  grid.openCell(x, y);
  counters.addMove();
  const time = storage.getTime();
  const moves = storage.getMoves();

  if (grid.isMine(x, y)) {
    setTimeout(() => gameEndCallback(true, time, moves, x, y), 0);
    counters.stopTimer();
    storage.setIsStarted(false);
  } else if (grid.isAllMinesFind()) {
    setTimeout(() => gameEndCallback(false, time, moves, x, y), 0);
    counters.stopTimer();
    storage.setIsStarted(false);
  }
};

const addGameEndHandler = (callback) => {
  gameEndCallback = callback;
};

const rightClickHandler = (isFlaged, x, y) => {
  if (!storage.getIsStarted()) {
    startNew(10);
    grid.setMines(10, y, x);
    counters.startTimer();
    storage.setIsStarted(true);
  }

  grid.setFlag(isFlaged, x, y);
  counters.countFlags(isFlaged);
  counters.countMines();
};

const save = () => {
  storage.saveGame();
};

export default {
  leftClickHandler,
  rightClickHandler,
  addGameEndHandler,
  startNew,
  save,
};
