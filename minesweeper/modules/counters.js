import storage from './storage.js';

let timer = null;
let tickCallback = null;
let movesCallback = null;

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

const reset = () => {
  stopTimer();
  storage.setTime(0);
  storage.setMoves(0);
  tickCallback(0);
  movesCallback(0);
};

const addTickHandler = (callback) => {
  tickCallback = callback;
};

const addMoveHandler = (callback) => {
  movesCallback = callback;
};

export default {
  startTimer,
  stopTimer,
  addMove,
  reset,
  addTickHandler,
  addMoveHandler,
};