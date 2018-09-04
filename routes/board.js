var express = require('express');
var router = express.Router();

router.get('/buildBoard', function(req, res) {
  console.log('GET /buildBoard');

  // getting config variables
  const board_size = req.query.board_size;
  const mine_count = req.query.mine_count;

  // calling function to build board
  game_board = buildBoard(board_size, mine_count);

  res.send(game_board);
});

/*
  * Builds game board to spec of board_size and mine_count
  * Calls again if not all mines used, returns game_board upon success
*/
function buildBoard(board_size, mine_count) {
  // counting variable to ensure all mines are used
  var used_mines = 0;

  // creating 2d array to act as game board
  var game_board = [];
  for (var i = 0; i < board_size; i++) {
    game_board[i] = [];
  }
  // populating game board
  for (var i = 0; i < board_size; i++) {
    for (var j = 0; j < board_size; j++) {
      // boolean to determine if index should be mine
      // only checks if there are still mines left
      if (used_mines < mine_count) {
        const is_mine = Math.random() < 0.25;
        if (is_mine == true) {
          game_board[i][j] = "M";
          used_mines++;
        } else {
          game_board[i][j] = "*";
        }
      } else {
        game_board[i][j] = "*";
      }
    }
  }

  // try again if all mines weren't used
  if (used_mines != mine_count) {
    console.log("Not all mines used, rebuilding board...");
    buildBoard(board_size, mine_count);
  } else {
    return game_board;
  }
}

module.exports = router;
