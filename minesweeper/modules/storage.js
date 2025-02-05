import State from './state.js';

const gridKey = 'grid';
const timeKey = 'time';
const movesKey = 'moves';
const flagsKey = 'flags';
const minesKey = 'mines';
const sizeKey = 'size';
const isStartedKey = 'isStarted';
const themeKey = 'theme';
const audioKey = 'audio';
const savedGameKey = 'savedGame';
const savedResultsKey = 'savedResults';

const initGrid = (size) => {
  const grid = [];
  for (let y = 0; y < size; y += 1) {
    const cellsRow = [];
    for (let x = 0; x < size; x += 1) {
      cellsRow.push({ isMine: false, mineCount: 0, state: State.Closed });
    }
    grid.push(cellsRow);
  }

  return grid;
};

const setGrid = (grid) => localStorage.setItem(gridKey, JSON.stringify(grid));

const getGrid = () => JSON.parse(localStorage.getItem(gridKey));

const setTime = (seconds) => localStorage.setItem(timeKey, seconds);

const getTime = () => +(localStorage.getItem(timeKey) || 0);

const setMoves = (moves) => localStorage.setItem(movesKey, moves);

const getMoves = () => +localStorage.getItem(movesKey);

const setFlags = (flags) => localStorage.setItem(flagsKey, flags);

const getFlags = () => +localStorage.getItem(flagsKey);

const setMines = (mines) => localStorage.setItem(minesKey, mines);

const getMines = () => {
  const size = localStorage.getItem(minesKey);

  return size ? +size : 10;
};

const setIsStarted = (isStarted) => localStorage.setItem(isStartedKey, isStarted ? 1 : 0);

const getIsStarted = () => !!+localStorage.getItem(isStartedKey);

const setSize = (size) => localStorage.setItem(sizeKey, size);

const getSize = () => {
  const size = localStorage.getItem(sizeKey);

  return size ? +size : 10;
};

const setTheme = (theme) => localStorage.setItem(themeKey, theme);

const getTheme = () => localStorage.getItem(themeKey);

const setAudio = (audio) => localStorage.setItem(audioKey, audio);

const getAudio = () => localStorage.getItem(audioKey);

const setResults = (results) => localStorage.setItem(savedResultsKey, JSON.stringify(results));

const getResults = () => JSON.parse(localStorage.getItem(savedResultsKey));

const saveResults = () => {
  const results = getResults()
    ? getResults()
    : [];

  if (results.length >= 10) {
    results.pop();
  }
  results.unshift({
    time: getTime(),
    moves: getMoves(),
    size: getSize(),
    mines: getMines(),
  });

  setResults(results);
};

const saveGame = () => {
  const game = {
    grid: getGrid(),
    time: getTime(),
    moves: getMoves(),
    flags: getFlags(),
    theme: getTheme(),
    audio: getAudio(),
    results: JSON.parse(localStorage.getItem(savedResultsKey)),
  };
  localStorage.setItem(savedGameKey, JSON.stringify(game));
};

const loadGame = () => {
  const game = JSON.parse(localStorage.getItem(savedGameKey));
  if (game) {
    setGrid(game.grid);
    setTime(game.time);
    setMoves(game.moves);
    setFlags(game.flags);
    setTheme(game.theme);
    setAudio(game.audio);
    setIsStarted(true);
    return true;
  }
  setGrid(initGrid(getSize()));
  setTime(0);
  setMoves(0);
  setFlags(0);
  setTheme(getTheme());
  setAudio(getAudio());
  setIsStarted(false);
  return false;
};

const removeGame = () => {
  localStorage.removeItem(savedGameKey);
};

export default {
  setGrid,
  getGrid,
  setTime,
  getTime,
  setMoves,
  getMoves,
  setFlags,
  getFlags,
  setMines,
  getMines,
  setSize,
  getSize,
  setTheme,
  getTheme,
  setAudio,
  getAudio,
  setIsStarted,
  getIsStarted,
  saveGame,
  loadGame,
  removeGame,
  setResults,
  getResults,
  saveResults,
};
