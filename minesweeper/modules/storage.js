const gridKey = 'grid';
const timeKey = 'time';
const movesKey = 'moves';

const setGrid = (grid) => localStorage.setItem(gridKey, JSON.stringify(grid));

const getGrid = () => JSON.parse(localStorage.getItem(gridKey));

const setTime = (seconds) => localStorage.setItem(timeKey, seconds);

const getTime = () => +(localStorage.getItem(timeKey) || 0);

const setMoves = (moves) => localStorage.setItem(movesKey, moves);

const getMoves = () => +localStorage.getItem(movesKey);

export default {
  setGrid,
  getGrid,
  setTime,
  getTime,
  setMoves,
  getMoves,
};
