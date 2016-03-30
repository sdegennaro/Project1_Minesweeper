console.log("...loaded");
//wireframes, user stories, pseudo coding;
//Minesweeper:

//Make the game an object
var minesweeper = {};

//functions to create new tile and row objects, avoids scope issues and ensures I'm actually creating a new object each time rather than connecting to exisiting ones
var makeTile = function(){
  var tile ={};
  return tile;
};
var makeRow = function(){
  var row = {}
  return row;
};

//set up array to hold the id of tiles that have already been checked for bombs
var checkedTiles = [];

//set how many mines to start and begin bomb counter
minesweeper.startingBombCount = 10
minesweeper.bombsLeft = minesweeper.startingBombCount;
//set the size of the board, num tiles x num tiles
minesweeper.boardSize = 10;
//set time to 0
minesweeper.time = 0;


//function to create the elements of the board
minesweeper.makeBoard = function(){
  //displays the bomb count and time in the game
  $("#bombCounter").text("Bombs: " +minesweeper.startingBombCount)
  $("#timer").text("Time: "+minesweeper.time);
  // //create board object
  minesweeper.board = {}
  //increment up to boardSize to create rows, as divs with class and id
  for (var i = 0; i < this.boardSize; i++) {
      minesweeper.board[i] = makeRow();
      minesweeper.board[i]=$("<div>", {
        class: "row",
        id: "row"+i
        });
    //append each row to the boardContainer div
      $("#boardContainer").append(minesweeper.board[i]);
    //for each row that's being created, also decided by boardSize, create one tile for each column
      for (var j = 0; j < this.boardSize; j++) {
          minesweeper.board[i][j] = makeTile();
          minesweeper.board[i][j] = $("<div>",{
            class: "tile",
            id: "row"+i+"tile"+j,
            });
      //add the tiles to the row
          $("#row" + i).append(minesweeper.board[i][j]);
      };
  };
//call the function to makeBombs
  this.makeBombs();
  //call to count the bombs for each tile
  this.setBombCount();
  //call function to set up the click event on the tiles
  this.setClickHandler();
  //board should be all set up! ready to play!
};

minesweeper.makeBombs = function(){
   var i = 0;
   //while loop since you may hit the same square twice, in which case you'd need to loop again so can't use for loop
   while(i < this.startingBombCount) {
     //randomly pick a row and column
       var rowIndex = Math.floor(Math.random() * this.boardSize);
       var columnIndex = Math.floor(Math.random() * this.boardSize);
     //if that tile already has a bomb, you should loop again
       if ($("#row"+rowIndex+"tile"+columnIndex).hasClass("bomb") === true){
         console.log("already a bomb!");
        //if it doesn't, you can add a bomb.
       } else{
          $("#row"+rowIndex+"tile"+columnIndex).addClass("bomb");
          i++;
       };
   };
};


minesweeper.setBombCount = function(){
  //going to have to loop through all of the squares. since we know how many there are, can use a for loop
  //for every row
  for (var i = 0; i < this.boardSize; i++) {
      //and for every column in that row, giving you a single tile on each loop with row i and column j
      for (var j = 0; j < this.boardSize; j++) {
          //start a count of how many bombs surround the tile
          var bombCount = 0;
          // //make an array of its neighbors
          var allNeighbors = this.makeNeighborsArray(i,j)
          //for each of the neighbors, if they're a bomb add 1 to the bombCount of the current tile
          $.each(allNeighbors,function(i,val){
              if(val.hasClass("bomb")){
                bombCount++;
              };
          });
          //add bombCount as an attribute to current tile
          $("#row" + i + "tile"+ j).attr("bombCount", bombCount);
      };
  };
};

minesweeper.makeNeighborsArray = function(i,j){
  //receive a tile's row and column and find all of its neighbors

  var topLeftNeighbor = $("#row" + (i-1) + "tile"+ (j-1));
  var topNeighbor = $("#row" + (i-1) + "tile"+ j);
  var topRightNeighbor = $("#row" + (i-1) + "tile"+ (j-(-1)));
  var leftNeighbor = $("#row" + i + "tile"+ (j-1));
  var rightNeighbor = $("#row" + i + "tile"+ (j-(-1)));
  var bottomLeftNeighbor = $("#row" + (i-(-1)) + "tile"+ (j-1));
  var bottomNeighbor = $("#row" + (i-(-1)) + "tile"+ j);
  var bottomRightNeighbor = $("#row" + (i-(-1)) + "tile"+ (j-(-1)));
  var neighborsArray = [topLeftNeighbor,topNeighbor,topRightNeighbor,leftNeighbor,rightNeighbor,bottomLeftNeighbor,bottomNeighbor, bottomRightNeighbor];
  return neighborsArray;
};

//increments the time value and placesg it in the timer div
minesweeper.incrementTimer = function(){
    minesweeper.time ++;
    $("#timer").text("Time: "+minesweeper.time);
};

//create a variable for the interval so it can be cleared later
minesweeper.startTimer = function(){
  minesweeper.interval = setInterval(scope.incrementTimer,1000);
}

//attaches the increment function to the first clickon the game container and performs the function on a 1 sec interval
minesweeper.TimerHandler = function(){
    $("#gameContainer").one("click", function(e){
      minesweeper.startTimer();
    });
};
//clears the interval
minesweeper.stopTimer = function(){
  clearInterval(minesweeper.interval);
};

//create a click handler that will be attached to all of the tiles
minesweeper.setClickHandler = function(){
  var scope=this;
  //before any other click event options, set up the explosion on click
  scope.explodeHandler();
  //if it doesn't explode:
  //start the time, game begins;
  scope.TimerHandler()
  //on click of any element with tile class
  $(".tile").click(function(e){
      // if the clicked tile has a flag on it, do nothing
      if(e.target.classList.contains("flag") == true){
          return;
      } else{
        //if the clicked tile is not in the array of tiles that have already been checked, check it for a bomb
          if(checkedTiles.indexOf(e.target) == -1){
            //if the tile is not bomb,
              if(scope.checkBomb(e.target) != true){
                  //add the tile to the array of checked tiles
                  checkedTiles.push(e.target);
                  //call the checkBombCount function
                  scope.checkBombCount(e.target);
                  //when you click and add the tile to checkedTiles array, that array's size is equal to the number of tiles on the board minus the number of bombs, you win
                  if(checkedTiles.length>= ((scope.boardSize*scope.boardSize)-scope.startingBombCount)){
                    scope.winGraphic();
                    //restart after 3.5 seconds
                    setTimeout(scope.restart,3500);
                  };
              };
          };
      };
    });
  };

minesweeper.checkBomb = function(tileClicked){
  //if the tile that's been clicked has a bomb, change all the tiles to red and show bomb icons in the bomb tiles
  if(tileClicked.classList.contains("bomb")){
     console.log("boom!");
     $(".tile").css({
      "background-color":"red",
      "color":"red"
      });
     $(".bomb").css({
       "content": "url(http://simpleicon.com/wp-content/uploads/bomb.png)"
     });
     //return true so this can be used for clickHandler
     return true;
  };
};

minesweeper.checkBombCount = function(tile){
  //since we set bombCount at board creation, get that value
  var bombCount = parseInt(tile.getAttribute("bombCount"));
  //do nothing if there's a flag
  if(tile.classList.contains("flag")){
    return;
  } else{
    //if there's a value, add the num class and add the bombCount value as text inside the element
    if(bombCount > 0 ){
      //the num class is defined in styles.css and makes the tile look clicked
      tile.classList.add("num");
      tile.innerText = bombCount;
      return;
     } else {
       tile.classList.add("num");
       tile.innerText = "";
       //if bombCount is 0, get the tile's row and column
       var row =tile.getAttribute("id")[3];
       var column = tile.getAttribute("id")[8];
       //make array of all neighbors
       var allNeighbors = this.makeNeighborsArray(row,column);
       $.each(allNeighbors,function(i,val){
         //run neighborCheck function on each
            minesweeper.neighborCheck(val);
          });
     };
   };
};


minesweeper.neighborCheck = function(tile){
  //if the tile has length (i.e. exists) and is has not already been checked
  if(tile.length == true && checkedTiles.indexOf(tile[0]) == -1){
  //add it to the checkTiles array
      checkedTiles.push(tile[0]);
  //run checkBombCount
      this.checkBombCount(tile[0]);
  }
}

//run restart if the newGameButton is clicked
minesweeper.setButtonHandler = function(){
  var scope=this;
  $("#newGameButton").click(function(e){
    scope.restart();
  });
};
//show images on a win
minesweeper.winGraphic =function(){
  //empty the boardContainer of elementChildren
  $("#boardContainer").empty();
  //create a heading
  var winText = $("<h1>").attr({"id":"winText"});
  //create images
  var winImage1 = $("<img src=http://www.sherv.net/cm/emoticons/war/soldier-with-gun.gif>").attr({
  "class":"winImage",
  "id":"winImage1"});
  var winImage2 = $("<img src=http://www.sherv.net/cm/emoticons/war/soldier-with-gun.gif>").addClass("winImage");
  var winImage3 = $("<img src=http://www.sherv.net/cm/emoticons/war/soldier-with-gun.gif>").addClass("winImage");
  // other image ideas:
  //http://images.zaazu.com/img/Desert-Storm-desert-storm-soldier-war-smiley-emoticon-000131-medium.gif>")
  //    http://www.sherv.net/cm/emoticons/war/smiley-face-soldier.gif>")

  //add you win text to heading and append the text and first image to the container
  winText.text("YOU WIN!");
  $("#boardContainer").append(winText);
  $("#boardContainer").append(winImage1);
  //remove the boardContainer border so it looks cleaner
  $("#boardContainer").css("border","none");

  //add some css to the image
  winImage1.css({
    "top": "20%",
    "margin": "1em"
  });
  //make the first image walk
  minesweeper.walkingSoldier(winImage1);

  //on a delay, add the second image and make it walk
  setTimeout(function(){
    minesweeper.addSoldier(winImage2);
    minesweeper.walkingSoldier(winImage2);
  },800);
  //on a delay, add the third image and make it walk
  setTimeout(function(){
    minesweeper.addSoldier(winImage3);
    minesweeper.walkingSoldier(winImage3);
  },1600);
};

//takes an image element and adds it to container, changes position in relation to previous child so they don't overlap
minesweeper.addSoldier = function(image){
  $("#boardContainer").append(image);
  var topPos = image.prev().position().top
  console.log(topPos);
  image.css("top", (topPos+100)+"px");
}

//takes image element input and decreases its left position so it moves across the screen
minesweeper.walkingSoldier = function(image){
  var distance= (image.parent().width());
  setInterval(function(){
     image.css("left",distance + 'px');
    if(distance < -100){
      distance = (image.parent().width());
    } else{
      distance = distance - 5;
    };
  }, 60);
};

//resets the container CSS, checkedTiles array, clears and stops the timer, and makes the board
minesweeper.restart = function(){

    $("#boardContainer").empty();
    $("#boardContainer").css({

    "display":"table",
    "visibility":"visible",
    "border": "1px solid darkgrey"
    });

    $("#gameContainer").css({

    "display":"table",
    "visibility":"visible",
    "background-image":"none"
    });
    checkedTiles = [];
    minesweeper.time = 0;
    minesweeper.stopTimer();
    minesweeper.makeBoard();
};

//right click handler for flags
minesweeper.setRightClickHandler = function(){
  var scope =this;
   document.oncontextmenu = function(e){
     //prevent default context menu to appear
        e.preventDefault();
        //if the tile has already been clicked, do nothing
        if(e.target.classList.contains("num")==true){
          return;
        } else{
          //if it has a flag, remove it, and add a bomb to the bomb counter
          if(e.target.classList.contains("flag")){
            e.target.classList.remove("flag");
            minesweeper.bombsLeft ++;
            $("#bombCounter").text("Bombs: " +minesweeper.bombsLeft);
          } else{
            //if it doesn't, add a flag and remove a bomb from the bomb counter
            e.target.classList.add("flag");
            minesweeper.bombsLeft = minesweeper.bombsLeft-1;
            $("#bombCounter").text("Bombs: " +minesweeper.bombsLeft);
          };
        };
    };
};


minesweeper.explodeHandler = function(){
  var board = $("#boardContainer")
  var container =$("#gameContainer")

  scope=this;
  //when a tile with bomb class is clicked
  $(".bomb").click(function(){
    //if it's a flag, do nothing
    if($(this).hasClass("flag") == true){
      return;
      //if it's not a flag change the css
    } else{
      //removes border so tiles explode evenly
      board.css("border", "none");
      //used jquery plugin, explodes into 100 equal pieces
      board.hide("explode", {pieces:100}, 1800);
      //adds explosion gif as background image
      container.css({
        "background-image":"url(http://www.animatedimages.org/data/media/1176/animated-explosion-image-0001.gif)",
        "background-size":"cover",
        "background-position": "center"
      });
    };
    //run restart after almost 2 secs
    setTimeout(scope.restart,1900);
  });
};


minesweeper.init = function(){
  this.makeBoard();
  this.setRightClickHandler();
  this.setButtonHandler();
};

/*
make the board an array of arrays of rows or arrays of tiles which are objects

Make a 10 x 10 grid

Randomly place 10 bombs in 10 tile objects

if the tile object is not a bomb, count the number of bombs surrounding it
  place that count as the value of the tile object
if no bombs around it, the value of the tile object should be null


show neighbors function
  if value is null and it's being displayed, show the eight tiles around it


when the user clicks a square:
  change display value to show the tile value (maybe use a class?)
  check if there's a bomb in the square
  if there is, game over BOOM
  tell the user they lose
  if there isn't, count the number of bombs in the surrounding eight squares
  if the count is  zero,

  if there is, show the square clicked
  the value of the square clicked should be equal to

  TO RESEARCH .data in jquery
*/

$(function(){

  minesweeper.init();

});
