Minesweeper Game

Created by Samantha DeGennaro March 2016 for General Assembly WDI, first project

This game application is a 10 x 10 recreation of Minesweeper and follows the
traditional Minesweeper rules.


The timer:
  The timer is displayed in the top right hand portion of the game board. With
  the first board click, either on intitial load or reload, the timer initiates.
  If the user quits and starts a new game, thus forcing reload, the timer will
  initiate with the button click. The timer counts seconds.

Flags:
  Flags should be placed by the user on tiles where they suspect a bomb to be
  present. Flags can be placed on tiles using the right or control click.
  Placing a flag on a tile stops all other click actions from affecting it.

Bombs:
  On load or reload, bombs are randomly placed amongst the 100 tiles by
  attaching a "bomb" class.

  The default value of bombs in this application is 10. That value can be
  changed using the minesweeper.startingBombCount variable found on line 22 of
  scripts.js.

The bomb counter:
  The bomb counter found in the upper left hand portion of the game board
  displays the total number of bombs. As the user places and removes flags, the
  counter adjusts. If the user finds their bomb count at 0 but has not yet won
  the game, that means they have placed flags on tiles without bombs.

Start game button:
  On load the game is ready to play, however if the user wants to quit their
  current game they can force reload with this button.

Game loss:
  The user loses by clicking a tile with the class bomb. When this occurs the
  board disappears via a jquery explosion animation and is replaced by a
  background explosion gif. After a few seconds, the game reloads.

Game win:
  If the user clicks all non-bomb class carrying tiles, they win. On a win,
  the board disappears and is replaced by "you win" text and images of soldiers
  that walk across the screen. After a few seconds, the game reloads.

Checking the tiles:
  On load, the board does not display text, and all tiles look the same.
  Each tile carries an attribute representing whether it is a bomb and if not,
  how many bombs surround it. As tiles are clicked, they change design and show
  their attribute values.

  When the user clicks, the program checks the attributes of that tile. If it
  is a bomb, game loss occurs.

  If it is not, the program checks the attribute representing how many bombs
  surround it. If that number is more than 0, text is created showing that bomb
  count and the tile is added to an array holding all of the tiles that have so
  far been checked.

  If the bomb count is 0, the program then checks the 8 tiles surrounding the
  clicked tile. If any of those tiles is already in the checked tile array,
  it is skipped. If it's not, the same bomb count check occurs, and if that
  tile has a bomb count of 0, the same check occurs to its neighbors, and so on.
  This allows for one click to initiate actions on dozens of tiles, given the
  right conditions.

  In the event that the checked tiles array is equal to the number of tiles
  minus the number of bombs, game win occurs.
