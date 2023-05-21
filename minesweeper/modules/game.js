import grid from './grid.js';
import counters from './counters.js';

let isStarted = false;

const leftClickHandler = (x, y) => {
  if (!isStarted) {
    grid.init(10);
    grid.setMines(10, y, x);
    counters.reset();
    counters.startTimer();
    isStarted = true;
  }

  grid.openCell(x, y);
  counters.addMove();
  const isMine = grid.isMine(x, y);

  if (isMine) {
    setTimeout(() => alert('Игра окончена. Попробуйте еще раз'), 500);
    counters.stopTimer();
    grid.init(10);
    isStarted = false;
  }
};

const rightClickHandler = (isFlaged, x, y) => {
  if (!isStarted) return;
  grid.setFlag(isFlaged, x, y);
  counters.countFlags(isFlaged);
};

export default {
  leftClickHandler,
  rightClickHandler,
};
