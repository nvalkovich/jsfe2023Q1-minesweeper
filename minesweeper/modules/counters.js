import storage from './storage.js';

let timer = null;
let tickCallback = null;
let movesCallback = null;
let flagsCallback = null;
let minesCallback = null;

const startTimer = () => {
  timer = setInterval(() => {
    const seconds = storage.getTime() + 1;
    storage.setTime(seconds);
    tickCallback(seconds);
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timer);
};

const addMove = () => {
  const moves = storage.getMoves() + 1;
  storage.setMoves(moves);
  movesCallback(moves);
};

const countFlags = (isFlaged) => {
  const flags = isFlaged ? storage.getFlags() - 1 : storage.getFlags() + 1;
  storage.setFlags(flags);
  flagsCallback(flags);
};

const countMines = (isFlaged) => {
  const currentMinesNum = storage.getMines();
  if (currentMinesNum === 0) return;

  const mines = isFlaged ? storage.getMines() + 1 : storage.getMines() - 1;
  storage.setMines(mines);
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
