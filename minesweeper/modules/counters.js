import storage from './storage.js';

let timer = null;
let tickCallback = null;
let movesCallback = null;
let flagsCallback = null;
let minesCallback = null;

let isTimerStarted = false;

const startTimer = () => {
  if (!isTimerStarted) {
    timer = setInterval(() => {
      const seconds = storage.getTime() + 1;
      storage.setTime(seconds);
      tickCallback(seconds);
    }, 1000);
  }
  isTimerStarted = true;
};

const stopTimer = () => {
  if (isTimerStarted) {
    clearInterval(timer);
  }
  isTimerStarted = false;
};

const addMove = () => {
  const moves = storage.getMoves() + 1;
  storage.setMoves(moves);
  movesCallback(moves);
};

const countFlags = (isFlaged) => {
  if (isFlaged === null || isFlaged === undefined) {
    flagsCallback(storage.getFlags());
    return;
  }
  const flags = isFlaged ? storage.getFlags() - 1 : storage.getFlags() + 1;
  storage.setFlags(flags);
  flagsCallback(flags);
};

const countMines = () => {
  const leftMines = storage.getMines() - storage.getFlags();
  const mines = leftMines < 0 ? 0 : leftMines;
  minesCallback(mines);
};

const reset = (defaultMinesNum) => {
  stopTimer();
  storage.setTime(0);
  storage.setMoves(0);
  tickCallback(0);
  movesCallback(0);
  flagsCallback(0);
  minesCallback(defaultMinesNum);
};

const addTickHandler = (callback) => {
  tickCallback = callback;
};

const addMoveHandler = (callback) => {
  movesCallback = callback;
};

const addFlagsHandler = (callback) => {
  flagsCallback = callback;
};

const addMinesHandler = (callback) => {
  minesCallback = callback;
};

export default {
  isTimerStarted,
  startTimer,
  stopTimer,
  addMove,
  reset,
  addTickHandler,
  addMoveHandler,
  addFlagsHandler,
  addMinesHandler,
  countFlags,
  countMines,
};
