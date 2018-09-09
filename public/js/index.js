// variables for stopwatch functionality
var seconds = 0;
var minutes = 0;
var hours = 0;
var stopwatch = new Stopwatch();

var flag_count;
var initial_mine_count;

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
    // set the initial flag count
    initial_mine_count = mine_count;
    updateFlags(mine_count);
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
  $('#modal_game_board').modal('show');

  // make all of the cells square, based on their widths
  $('#table_game_board td').height($('#table_game_board td').width());
}

/**
  * TODO this comment
  * onclick listener for getting location of table cell
*/
$('#table_game_board').click(function(data) {
  var cell = data.target || data.srcElement;
  // if the cell is flagged, then don't do anything on click
  if(cell.getAttribute('flagged') != 'true'){
    // const cell_obj = {
    //   row: cell.getAttribute('row'),
    //   col: cell.getAttribute('col'),
    //   value: cell.getAttribute('value')
    // };

    cellClicked(cell);
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

//Display Cell value
//Displays the cell value on the game_board
function displayValue(cell)
{
  var cellId = cell.getAttribute('row') + ',' + cell.getAttribute('col');
  cell.setAttribute('id', cellId);
  cell.setAttribute('isDisplayed', true);
  document.getElementById(cellId).innerHTML = cell.getAttribute('value');
}

//Calls displayValue() to show cell values and then handles the rules
//when telling what other cells will need to be cleared due to game rules
function cellClicked(cell) {
  console.log(cell);

  //Show Clicked Cell Value
  //displayValue(cell);

  //If Cell Value is mine
  if(cell.getAttribute('value') == "M")
  {
    //End Game modal
  }

  //If Cell Value is Not mine
  if(cell.getAttribute('value') != "M")
  {
    recReveal(cell.getAttribute('row') , cell.getAttribute('col'))
  }
};

//Recursivly reveals the correct cells
function recReveal(i, j)
{
  if(parseInt(i, 10) < game_board_before_start.length && parseInt(j, 10) < game_board_before_start[0].length && parseInt(i, 10) >= 0 && parseInt(j, 10) >= 0)
  {
    //Get Cell at i,j
    var table = document.getElementById('table_game_board');
    var row = table.rows[i];
    var cell = row.cells[j];

    if(!cell.getAttribute('isDisplayed'))
    {
      if(cell.getAttribute('value') == "0")
      {
        displayValue(cell);

        //Look in all directions
        recReveal(i,parseInt(j, 10) + 1);
        recReveal(parseInt(i, 10) + 1,parseInt(j, 10) + 1);
        recReveal(parseInt(i, 10) + 1,j);
        recReveal(parseInt(i, 10) + 1,parseInt(j, 10) - 1);
        recReveal(i,parseInt(j, 10) - 1);
        recReveal(parseInt(i, 10) - 1,parseInt(j, 10) - 1);
        recReveal(parseInt(i, 10) - 1,j);
        recReveal(parseInt(i, 10) - 1,parseInt(j, 10) + 1);
      }
      else if(cell.getAttribute('value') == "M")
      {

      }
      else
      {
        displayValue(cell);
      }
    }
  }
}

/*
  * Toggles flagged status of a cell
*/
function cellFlagged(cell) {
  // cell is currently flagged
  // toggle
  if (cell.getAttribute('flagged') == 'true') {
    cell.setAttribute('flagged', 'false');
    cell.setAttribute('background', "");
    incrementFlags();
  } else {
    // cell is not currently flagged
    // toggle only if user has flags left
    if (flag_count > 0) {
      cell.setAttribute('flagged', 'true');
      cell.setAttribute('background', "/images/flag.png");
      decrementFlags();
    }
  }
};

/*
  * updates the flag count variable/display
*/

function incrementFlags(){
  updateFlags(flag_count+1);
}

function decrementFlags(){
  updateFlags(flag_count-1);
}

function updateFlags(new_count){
  flag_count = new_count;
  $('#flag_count').html(flag_count);
}

/**
  * Dismisses start game modal
  * Calls function to display game board
  * Starts stopwatch
*/
function startGame() {
  // hide start game modal
  $('#modal_start_game').modal('hide');
  // display gameboard
  displayGameBoard(game_board_before_start);
  // start stopwatch
  stopwatch.run();

}

/**
  * Resets game with current settings by re-presenting game board modal
  * Resets stopwatch
  * Starts stopwatch again
  * Presents snackbar upon completion
*/
function resetGame() {
  // resetting stopwatch
  stopwatch.reset();
  // resetting flag count
  updateFlags(initial_mine_count);
  // displaying gameboard again
  displayGameBoard(game_board_before_start);
  // start stopwatch again
  stopwatch.run();
  // present snackbar alerting user that reset was successful
  $.snackbar({content: "Game reset!"});
}
