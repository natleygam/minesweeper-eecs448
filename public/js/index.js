/**
 * Instance of game manager used for everything
 * @type {GameManager}
 */
var game_manager = new GameManager();

// calling game manager to get config for game
game_manager.getConfig();



/**
  * click listener for board clear events
  * @param {Event} data
*/
$('#table_game_board').click(function(data) {
  // check to see if first click
  game_manager.checkFirstClick();

  var cell = (data.target || data.srcElement).parentElement;

  var isLoss = game_manager.board.cellClicked(cell);
  if (isLoss) {
    game_manager.loseGame();
  }

});



/**
  * right click listener for board flag events
  * @param {Event} data
  * @returns {Boolean} - always returns false to prevent context menu appearing
*/
$('#table_game_board').contextmenu(function(data) {
  // check to see if first click
  game_manager.checkFirstClick();

  var cell = (data.target || data.srcElement).parentElement;

  if(cell.getAttribute('isDisplayed') != "true") {
    game_manager.board.cellFlagged(cell);

    var is_win = game_manager.board.checkWin();
    if (is_win) {
      game_manager.winGame();
    }
  }

  // return false prevents right-click menu from coming up
  return false;
});
