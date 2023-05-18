const gridKey = 'grid';

const setGrid = (grid) => localStorage.setItem(gridKey, JSON.stringify(grid));

const getGrid = () => JSON.parse(localStorage.getItem(gridKey));

export default {
  setGrid,
  getGrid,
};
