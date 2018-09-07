var express = require('express');
var router = express.Router();

router.get('/buildBoard', function(req, res) {
  console.log('GET /buildBoard');

  // getting config variables
  const board_rows = req.query.board_rows;
  const board_cols = req.query.board_cols;
  const mine_count = req.query.mine_count;

  // calling function to build board
  res.send(buildBoard(board_rows, board_cols, mine_count));
});

/*
  * Builds game board to spec of board_rows, board_cols, and mine_count
  * Lopps if not all mines used, returns game_board upon successful use of all mines
*/
function buildBoard(board_rows, board_cols, mine_count) {

  // creating 2d array to act as game board
  var game_board = [];
  for(var i = 0; i < board_rows; i++) {
    game_board[i] = [];
    for(var j = 0; j < board_cols; j++) {
      game_board[i][j] = "*";
    }
  }

  // populating game board
  var mine_placed;
  for(var i = 0; i < mine_count; i++) {
    mine_placed = false;
    do{
      var row = Math.floor(Math.random() * board_rows);
      var col = Math.floor(Math.random() * board_cols);
      if(game_board[row][col] == "*"){
        mine_placed = true;
        game_board[row][col] = "M";
      }
    }while(!mine_placed);
  }

  // return good board now that out of loop
  return game_board;
}

function callBuild() {
  console.log('called');
}

module.exports = router;
