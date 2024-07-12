1. [Task](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/minesweeper/README.md)
2. Screenshot: 
![image](https://github.com/rolling-scopes-school/nvalkovich-JSFE2023Q1/assets/105563182/7f5b97cd-df1c-442b-93c3-dda47cb1cf9d)
![image](https://github.com/rolling-scopes-school/nvalkovich-JSFE2023Q1/assets/105563182/7ddc4552-6829-4ca2-9be6-eb1faa064ed4)
![image](https://github.com/rolling-scopes-school/nvalkovich-JSFE2023Q1/assets/105563182/e03a67d2-3b69-4db2-bfb0-b0d7830c6955)
3. [Deploy](https://rolling-scopes-school.github.io/nvalkovich-JSFE2023Q1/minesweeper/)
- Basic scope 
  - [x] layout, design, responsive UI: +10
  - [x] at the beginning state of the game, the frame has size 10x10 and is filled with unopened cells. Should be 10 mines on field by default: +10
  - [x] when user click on cells - it should be opened and marked as one of the following state: empty cell, cell with number, or cell with mine: +10
  - [x] the game should end when the player reveals all cells that do not contain mines (win) or clicks on mine (lose) and related message is displayed at the end of the game: +10
- Advanced scope
  - [x] mines are placed after the first move, so that user cannot lose on the first move. +20
  - [x] user can mark “mined” cells using flags so as not to accidentally open them displaying the number of mines remaining and displaying number of used flags: +10
  - [x] game duration and number of clicks are displayed: +15
  - [x] when user opens a square that does not touch any mines, it will be empty and the adjacent squares will automatically open in all directions until reaching squares that contain numbers: +15
- Hacker scope
  - [x] sound accompaniment (on/off) when clicking on cell and at the end of the game: +10
  - [x] implement ability to change the size (easy - 10x10, medium - 15x15, hard - 25x25) and number of mines for each size of the field (from 10 to 99): +20
  - [x] implemented saving the state of the game: +10
  - [x] option to choose different themes for the game board (dark/light themes): +10
