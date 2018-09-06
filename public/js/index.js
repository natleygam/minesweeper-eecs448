// variables for stopwatch functionality
var seconds = 0;
var minutes = 0;
var hours = 0;
var stopwatch;

getConfig();

/**
  * Calls modal to get game config
*/
function getConfig() {
  // hiding start game modal and game board modal in case coming from there
  $('#modal_start_game').modal('hide');
  $('#modal_game_board').modal('hide');
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
    var game_board = buildGameBoard(board_rows, board_cols, mine_count);
    // dismiss config modal
    $('#modal_game_setup').modal('hide');
    // show game start modal
    $('#modal_start_game').modal('show');
  }
}

/**
  * Displays game board after populating table in modal
*/
function displayGameBoard(game_board) {
  // getting table
  var table = document.getElementById('table_game_board');

  // clearing table in case coming from a resetGame()
  $("#table_game_board tr").remove();

  // iterating through each row and each cell of the gameboard
  // creating new rows and new cells for each element
  // setting cell value equal to game board value at that index
  for (var i = 0; i < game_board_before_start.length; i++) {
    var new_row = table.insertRow(i);
    for (var j = 0; j < game_board_before_start[0].length; j++) {
      var new_cell = new_row.insertCell(j);
      current_row = table.rows[i];
      current_cell = current_row.cells[j];
      current_cell.setAttribute('row', i);
      current_cell.setAttribute('col', j);
      current_cell.setAttribute('value', game_board_before_start[i][j]);
      current_cell.setAttribute('flagged', false);
      current_cell.style.backgroundSize = 'contain';
    }
  }

  // resizing modal
  $('#modal_game_board').find('.modal-body').css({
    width: 'auto',
    height: 'auto', 'max-height':'75vh'
  });

  // displaying game board modal
  console.log('showing modal again');
  $('#modal_game_board').modal('show');
}

/**
  * TODO this comment
  * onclick listener for getting location of table cell
*/
$('#table_game_board').click(function(data) {
  var cell = data.target || data.srcElement;
  // if the cell is flagged, then don't do anything on click
  if(cell.getAttribute('flagged') != 'true'){
    const cell_obj = {
      row: cell.getAttribute('row'),
      col: cell.getAttribute('col'),
      value: cell.getAttribute('value')
    };

    cellClicked(cell_obj);
  }
});


/**
  * right click listener
*/
$('#table_game_board').contextmenu(function(data) {
  var cell = data.target || data.srcElement;

  cellFlagged(cell);

  // return false prevents right-click menu from coming up
  return false;
});

/*
  * TODO this function
*/
function cellClicked(cell) {
  console.log(cell);
};

/*
  * toggles flagged status of a cell
*/
function cellFlagged(cell) {

  // get opposite of the current flagged status
  var new_flagged_status = !(cell.getAttribute('flagged') == 'true');
  // toggle flagged status
  cell.setAttribute('flagged', new_flagged_status);
  console.log(cell);
  if(new_flagged_status){
    cell.setAttribute('background', "/images/flag.jpg");
  }
  else{
    cell.setAttribute('background', "");
  }
};

/**
  * Begins set timeout function to increment stopwatch variables
*/
function runStopwatch() {
  stopwatch = setTimeout(incrementStopWatch, 1000);
}

/**
  * Clears set timeout and resets stopwatch variables
*/
function resetStopwatch() {
  clearTimeout(stopwatch);
  seconds = 0;
  minutes = 0;
  hours = 0;
}

/**
  * Increments stopwatch variables and updates stopwatch label on gameboard
*/
function incrementStopWatch() {
  // increment variables
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }

  // update label
  var label = document.getElementById('label_stopwatch')
  label.innerHTML = 'Elapsed time: ';
  if (hours > 9) {
    label.innerHTML += hours + ':';
  } else {
    label.innerHTML += '0' + hours + ':';
  }
  if (minutes > 9) {
    label.innerHTML += minutes + ':';
  } else {
    label.innerHTML += '0' + minutes + ':';
  }
  if (seconds > 9) {
    label.innerHTML += seconds;
  } else {
    label.innerHTML += '0' + seconds;
  }

  // call function to continue stopwatch
  runStopwatch();
}

/**
  * Starts game
  * TODO make this a better comment
*/
function startGame() {
  // hide start game modal
  $('#modal_start_game').modal('hide');
  // display gameboard
  displayGameBoard(game_board_before_start);
  // start stopwatch
  runStopwatch();
}

/**
  * Resets game with current settings by re-presenting game board modal
  * Resets stopwatch
*/
function resetGame() {
  // resetting stopwatch
  resetStopwatch();
  // displaying gameboard again
  displayGameBoard(game_board_before_start);
  // start stopwatch again
  runStopwatch();
  // present snackbar alerting user that reset was successful
  $.snackbar({content: "Game reset!"});
}
