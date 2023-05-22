import grid from './grid.js';
import counters from './counters.js';
import storage from './storage.js';

let gameEndCallback = null;

let isStarted = false;

const startNew = (defaultMinesNum) => {
  grid.init(10);
  counters.reset(defaultMinesNum);
  isStarted = false;
};

const leftClickHandler = (defaultMinesNum, x, y) => {
  if (!isStarted) {
    startNew(defaultMinesNum);
    grid.setMines(10, y, x);
    counters.startTimer();
    isStarted = true;
  }

  grid.openCell(x, y);
  counters.addMove();
  const time = storage.getTime();
  const moves = storage.getMoves();

  if (grid.isMine(x, y)) {
    setTimeout(() => gameEndCallback(true, time, moves, x, y), 0);
    counters.stopTimer();
    isStarted = false;
  } else if (grid.isAllMinesFind()) {
    setTimeout(() => gameEndCallback(false, time, moves, x, y), 0);
    counters.stopTimer();
    isStarted = false;
  }
};

const addGameEndHandler = (callback) => {
  gameEndCallback = callback;
};

const rightClickHandler = (isFlaged, x, y) => {
  if (!isStarted) return;
  grid.setFlag(isFlaged, x, y);
  counters.countFlags(isFlaged);
  counters.countMines(isFlaged);
};

export default {
  leftClickHandler,
  rightClickHandler,
  addGameEndHandler,
  startNew,
};
