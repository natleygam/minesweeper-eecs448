// variables for use in index page
var game_board;

/*
  * Builds game environment
*/
function buildGameBoard(board_size, mine_count) {
  // config object to send to backend
  const config = {
    board_size: board_size,
    mine_count: mine_count
  };
  // making call to backend
  $.ajax({
      url: '/board/buildBoard',
      data: config,
      success: function (data) {
        console.log(data);
        game_board = data;
      },
      error: function (data) {
        console.log(data);
      }
  });
  // returning built game board
  return game_board;
}
