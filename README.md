Minesweeper Game

Created by Samantha DeGennaro March 2016 for General Assembly WDI, first project

This game application is a 10 x 10 recreation of Minesweeper and follows the
traditional rules.

The timer:
  The timer is displayed in the top right hand portion of the game board. With
  the first board click, either on intitial load or reload, the timer initiates.
  If the user quits and starts a new game, thus forcing reload, the timer will
  initiate with the button click. The timer counts seconds.

The bomb counter:
  The default value of bombs in this application is 10. That value can be
  changed using the minesweeper.startingBombCount variable found on line 22 of
  scripts.js. 

On load, a board with 100 tiles appears. In the top right hand corner, the user
sees how many bombs are present. The user can click anywhere on the board.
With the first board click, the timer initiates.

If the first click (or any subsequent click) is an unflagged bomb, the board
explodes and the game reloads.

On reload, the timer initiates with the first click. If the user decides to
