// variables for stopwatch functionality
var seconds = 0;
var minutes = 0;
var hours = 0;
var stopwatch = new Stopwatch();

// instance of game board
var board = new GameBoard();

getConfig();

/**
  * Calls modal to get game config
*/
function getConfig() {
  // resetting stopwatch in case coming from game lose modal
  stopwatch.reset();
  // hiding start game modal and game board modal in case coming from there
  $('#modal_game_board').modal('hide');
  $('#modal_start_game').modal('hide');
  $('#modal_lose').modal('hide');
  // show games set up modal
  $('#modal_game_setup').modal('show');
}

/*
  * Ensures board_rows, board_cols, and mine_count is in proper format
  * Presents modal if in bad format
  * Calls buildGame() if in good format
*/
function validateConfig() {
  // reset visiblity of error phrases in modal
  document.getElementById('phrase_board_size').style.display = "block";
  document.getElementById('phrase_mine_count').style.display = "block";

  // get input values
  const board_rows = document.getElementById('input_board_rows').value;
  const board_cols = document.getElementById('input_board_cols').value;
  const mine_count = document.getElementById('input_mine_count').value;

  var bad_board_size = false;
  var bad_mine_count = false;

  // check for bad entry on board_rows and board_cols
  // hide error phrases on modal if entry is good
  if (board_rows == "" || board_rows < 2) {
    bad_board_size = true;
  } else {
    //document.getElementById('phrase_board_size').style.display = "none";
  }
  if (board_cols == "" || board_cols < 2) {
    bad_board_size = true;
  } else {
    //document.getElementById('phrase_board_size').style.display = "none";
  }
  if (mine_count == "" || mine_count < 1 || mine_count > ((board_rows * board_cols)-1)) {
    bad_mine_count = true;
  } else  {
    //document.getElementById('phrase_mine_count').style.display = "none";
  }

  // show error modal if either error is triggered
  if (bad_board_size == true || bad_mine_count == true) {
    if (bad_board_size != true) {
      document.getElementById('phrase_board_size').style.display = "none";
    }
    if (bad_mine_count != true) {
      document.getElementById('phrase_mine_count').style.display = "none";
    }
    $('#modal_bad_config').modal('show');
  } else {
    // build game board upon good config
    board.buildGameBoard(board_rows, board_cols, mine_count);
    // dismiss config modal
    $('#modal_game_setup').modal('hide');
    // show game start modal
    $('#modal_start_game').modal('show');
    // set the initial mine count
    board.initialMineCount(mine_count);
    // set the initial flag count
    var flag_count = mine_count;
    board.initialFlagCount(flag_count);
  }
}

/**
  * TODO this comment
  * onclick listener for getting location of table cell
*/
$('#table_game_board').click(function(data) {
  // check to see if first click
  if (board.first_click == true) {
    // start stopwatch
    stopwatch.run();
    board.first_click = false;
  }
  var cell = data.target || data.srcElement;
  // if the cell is flagged, then don't do anything on click
  if(cell.getAttribute('flagged') != 'true'){
    board.cellClicked(cell);
  }
});


/**
  * right click listener
*/
$('#table_game_board').contextmenu(function(data) {
  var cell = data.target || data.srcElement;

  if(cell.getAttribute('isDisplayed') != "true") {
    board.cellFlagged(cell);
  }

  // return false prevents right-click menu from coming up
  return false;
});

/**
  * Dismisses start game modal
  * Calls function to display game board
  * Starts stopwatch
*/
function startGame() {
  // hide start game modal
  $('#modal_start_game').modal('hide');
  // display gameboard
  board.displayGameBoard();
}

/**
  * Resets game with current settings by re-presenting game board modal
  * Resets stopwatch
  * Starts stopwatch again
  * Presents snackbar upon completion
*/
function resetGame() {
  $('#modal_lose').modal('hide');
  // resetting stopwatch
  stopwatch.reset();
  // resetting flag count
  board.initialFlagCount(board.initial_flag_count);
  // displaying gameboard again
  board.displayGameBoard(board.initial_board);
  // present snackbar alerting user that reset was successful
  $.snackbar({content: "Game reset!"});
}
