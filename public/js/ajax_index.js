// variables for use in index page
var game_board_before_start;
var game_board;

/*
  * Builds game environment
*/
function buildGameBoard(board_rows, board_cols, mine_count) {
  // config object to send to backend
  const config = {
    board_rows: board_rows,
    board_cols: board_cols,
    mine_count: mine_count
  };
  // making call to backend
  $.ajax({
      url: '/board/buildBoard',
      data: config,
      success: function (data) {
        console.log(data);
        game_board_before_start = data;
        game_board = data;
      },
      error: function (data) {
        console.log(data);
      }
  });
  return game_board_before_start;
}
