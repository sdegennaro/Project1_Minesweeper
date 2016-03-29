console.log("...loaded");
//wireframes, user stories, pseudo coding;
//Minesweeper:

//Make the game an object
var minesweeper = {};
//function to create new tile objects
var makeTile = function(){
  var tile ={};
  // tile.bomb = false;
  return tile;
};
//function to create new row objects
var makeRow = function(){
  var row = {}
  return row;
};
//set up array to hold the id of tiles that have already been checked for bombs
var checkedTiles = [];
//set how many mines
minesweeper.mineCount = 10;
//set the size of the board, num tiles x num tiles
minesweeper.boardSize = 10;

//set the size of the tiles DELEEEETE*********
// minesweeper.tileSize = 2;


//function to create the elements of the board
minesweeper.makeBoard = function(){
  //create board object
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
};

minesweeper.makeBombs = function(){
   var i = 0;
   while(i < this.mineCount) {
     var rowIndex = Math.floor(Math.random() * this.boardSize);
     var columnIndex = Math.floor(Math.random() * this.boardSize);
   //if it's true, that square already has a bomb and you should loop again
     if ($("#row"+rowIndex+"tile"+columnIndex).hasClass("bomb") === true){
       console.log("already a bomb!");
     } else{
        $("#row"+rowIndex+"tile"+columnIndex).attr("class", "tile bomb");
        // console.log("made a bomb!");
        i++;
     };
   };
};

minesweeper.setBombCount = function(){
  for (var i = 0; i < this.boardSize; i++) {
    for (var j = 0; j < this.boardSize; j++) {
      var bombCount = 0;
      var topLeftNeighbor = $("#row" + (i-1) + "tile"+ (j-1));
      var topNeighbor = $("#row" + (i-1) + "tile"+ j);
      var topRightNeighbor = $("#row" + (i-1) + "tile"+ (j-(-1)))
      var leftNeighbor = $("#row" + i + "tile"+ (j-1))
      var rightNeighbor = $("#row" + i + "tile"+ (j-(-1)))
      var bottomLeftNeighbor = $("#row" + (i-(-1)) + "tile"+ (j-1))
      var bottomNeighbor = $("#row" + (i-(-1)) + "tile"+ j)
      var bottomRightNeighbor = $("#row" + (i-(-1)) + "tile"+ (j-(-1)))
      if(topNeighbor.hasClass("bomb")){
            bombCount ++;
          };
      if(topLeftNeighbor.hasClass("bomb")){
            bombCount ++;
          };
      if(topRightNeighbor.hasClass("bomb")){
            bombCount ++;
          };
      if(bottomNeighbor.hasClass("bomb")){
            bombCount ++;
          };
      if(bottomLeftNeighbor.hasClass("bomb")){
            bombCount ++;
          };
      if(bottomRightNeighbor.hasClass("bomb")){
            bombCount ++;
          };
      if(leftNeighbor.hasClass("bomb")){
            bombCount ++;
          };
      if(rightNeighbor.hasClass("bomb")){
            bombCount ++;
          };
      $("#row" + i + "tile"+ j).attr("bombCount", bombCount);
    };
  };
};

minesweeper.setClickHandler = function(){
  var scope=this;
  $(".tile").click(function(e){
    // console.log(e.target);
    // scope.checkBomb(e.target);
    if(e.target.classList.contains("flag")){
      return;
    } else{
      if(checkedTiles.indexOf(e.target) == -1){
        if(scope.checkBomb(e.target) != true){
          checkedTiles.push(e.target);
          (scope.checkBombCount(e.target)!=true);
        };
        if(checkedTiles.length>= ((scope.boardSize*scope.boardSize)-scope.mineCount)){
          scope.winGraphic();
          setTimeout(scope.restart,3000);
        };
      }
    }
  });
};


minesweeper.setButtonHandler = function(){
  var scope=this;
  $("#newGameButton").click(function(e){
    scope.restart();
  })
}
minesweeper.winGraphic =function(){
  $("#boardContainer").empty();
  var winText = $("<h1>")
  winText.text("YOU WIN!")
  $("#boardContainer").append(winText)
}

minesweeper.restart = function(){
  var scope = this;
  $("#boardContainer").empty();
  $("#boardContainer").css({

  "display":"table",
  "visibility":"visible"
  });

  $("#gameContainer").css({

  "display":"table",
  "visibility":"visible",
  "background-image":"none"
  });
  // $("#boardContainer").show();
  checkedTiles = [];
  minesweeper.makeBoard();

}

minesweeper.setRightClickHandler = function(){

   document.oncontextmenu = function(e){
        e.preventDefault();
        e.target.classList.add("flag")
    };
}
  // $(".tile").click(function(e){
  //   e.preventDefault;
  //   if(window.event.ctrlKey){
  //     e.target.css("background-color","orange");
  //   }





minesweeper.checkBomb = function(tileClicked){
  this.explodeHandler();

  if(tileClicked.classList.contains("bomb")){
     console.log("boom!");
     $(".tile").css({
      "background-color":"red",
      "color":"red"
      });
     $(".bomb").css({
       "content": "url(http://simpleicon.com/wp-content/uploads/bomb.png)"
     })
     return true;
  }
}

minesweeper.explodeHandler = function(){
  var board = $("#boardContainer")
  var container =$("#gameContainer")
  var explosion=$("<img src=http://www.animatedimages.org/data/media/1176/animated-explosion-image-0001.gif>").css({
    "display":"none"

  })
  $("body").append(explosion)

  scope=this;
  $(".bomb").click(function(e){
    // board.css("border", "none");
    board.hide("explode", {pieces:100}, 1500)
    container.css({
      "background-image":"url(http://www.animatedimages.org/data/media/1176/animated-explosion-image-0001.gif)",
      "background-size":"cover",
      "background-position": "center"
    })
    // explosion.show("fade",1000)
    setTimeout(scope.restart,1500);
  })
}



// $("#hide").click(function(){
//                $(".target").hide( "explode", {pieces: 16 }, 2000 );
//             });

minesweeper.checkBombCount = function(tile){
  var bombCount = parseInt(tile.getAttribute("bombCount"))
  if(bombCount > 0 ){
    tile.classList.add("num");
    tile.innerText = bombCount;
    return true;
   } else {
     tile.classList.add("num");
     tile.innerText = "";
     var row =tile.getAttribute("id")[3]
    //  console.log(tile.getAttribute("id").match(/\d/));
     var column = tile.getAttribute("id")[8]
     this.topNeighbors(row, column);
     this.leftNeighbors(row, column);
     this.rightNeighbors(row, column);
     this.bottomNeighbors(row, column);
   };
};


minesweeper.neighborCheck = function(tile){
  if(tile.length == true && checkedTiles.indexOf(tile[0]) == -1){
  checkedTiles.push(tile[0]);
  this.checkBombCount(tile[0])
  }
}

minesweeper.topNeighbors = function(i,j){
    var topLeftNeighbor = $("#row" + (i-1) + "tile"+ (j-1));
    this.neighborCheck(topLeftNeighbor)
    var topNeighbor = $("#row" + (i-1) + "tile"+ j);
    this.neighborCheck(topNeighbor);
    var topRightNeighbor = $("#row" + (i-1) + "tile"+ (j-(-1)))
    this.neighborCheck(topRightNeighbor);

}

minesweeper.leftNeighbors = function(i,j){
  var leftNeighbor = $("#row" + i + "tile"+ (j-1))
  this.neighborCheck(leftNeighbor);
}
minesweeper.rightNeighbors = function(i,j){

  var rightNeighbor = $("#row" + i + "tile"+ (j-(-1)))
  this.neighborCheck(rightNeighbor);
}

// minesweeper.makeGameDesign =function(){
// //   // $(".tile").css{
// //   //   "width" : this.tileSize + "em";
// //   //   "height" : this.tileSize + "em";
// //   // }
//   $("#gameContainer").css{
//     "width" : (this.boardSize*this.tileSize + 4)+ "em"
//   }
// }

minesweeper.bottomNeighbors = function(i,j){
  var bottomLeftNeighbor = $("#row" + (i-(-1)) + "tile"+ (j-1))
  this.neighborCheck(bottomLeftNeighbor);
  var bottomNeighbor = $("#row" + (i-(-1)) + "tile"+ j)
  this.neighborCheck(bottomNeighbor);
  var bottomRightNeighbor = $("#row" + (i-(-1)) + "tile"+ (j-(-1)))
  this.neighborCheck(bottomRightNeighbor)
  // console.log(topLeftNeighbor,topNeighbor,topRightNeighbor, leftNeighbor,rightNeighbor, bottomLeftNeighbor, bottomNeighbor, bottomRightNeighbor)
}



// // minesweeper.checkNeighbors = function(tileClicked){
// //   var clickRow = console.log(tileClicked.getAttribute("id")[3]);
// //   var clickColumn = console.log(tileClicked.getAttribute("id")[7]);
// //   var bombCount = 0;
// //   this.checkBomb($("#row[" + (clickRow-1) + "]tile["+ clickColumn +"]"));
// };

/* set the bomb count
row1tile1 row1tile0, row1tile2,row0tile0,row0tile1,
$("#row[" + clickRow "-1]tile["+ clickColumn +"]")
row[i-1]tile[j-1]
row[i-1]tile[j+1]
row[i]tile[j+1]
row[i]tile[j-1]
row[i+1]tile[j]
row[i+1]tile[j-1]
row[i+1]tile[j+1]

if the tile clicked is a bomb, boom...game over
if it's not a bomb, check
*/

minesweeper.init = function(){
  this.makeBoard();
  this.setRightClickHandler();
  this.setButtonHandler();

}

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

})
