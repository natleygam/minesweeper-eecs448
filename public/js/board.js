/**
  * Definition of game board object
*/
class GameBoard {

  /**
    * @param {Number} num_rows - number of rows specified for board
    * @param {Number} num_cols - number of cols specified for board
    * @param {Number} mine_count - number of mines specified for board
    * @param {Number} [preset_index] - which preset this board is (0, 1, 2)
    */
  constructor(num_rows, num_cols, mine_count, preset_index) {
    // object properties
    this.board;
    // will be 0, 1, or 2 for one of the three preset board sizes, undefined otherwise
    this.preset_index = preset_index;
    // create percent bar under board
    this.percent_bar = new PercentBar(num_rows*num_cols);
    this.num_rows = num_rows;
    this.num_cols = num_cols;
    this.mine_count = mine_count;
    this.flag_count = 0;
    // number of flags that are also on mines
    this.flagged_mines = 0;
    // goes to false once user has clicked for the first time on a new board
    this.first_click = true;
    // what color to make each number in the cell
    this.color_enum = {
      "1": "blue",
      "2": "green",
      "3": "yellow",
      "4": "orange",
      "5": "red",
      "6": "violet",
      "7": "indigo",
      "8": "black"
    }
  }



  /**
    * Builds game board to spec of currently stored num_rows, num_cols, and mine_count
  */
  buildGameBoard() {
    // creating 2d array to act as game board
    this.board = [];
    for(var i = 0; i < this.num_rows; i++) {
      this.board[i] = [];
      for(var j = 0; j < this.num_cols; j++) {
        this.board[i][j] = "*";
      }
    }

    // populating game board
    var mine_placed;
    for(var i = 0; i < this.mine_count; i++) {
      mine_placed = false;
      do {
        var row = Math.floor(Math.random() * this.num_rows);
        var col = Math.floor(Math.random() * this.num_cols);
        if(this.board[row][col] == "*"){
          mine_placed = true;
          this.board[row][col] = "M";
        }
      } while (!mine_placed);
    }

    // generating adjacency counts
    var cur_mines;
    for (var i = 0; i < this.num_rows; i++) {
      for (var j = 0; j < this.num_cols; j++) {
        // if cell is a mine, don't need to generate count for it (duh)
        if (this.board[i][j] != "M") {
          cur_mines = 0;
          // go through all adjacent cells.
          for (var k = i-1; k <= i+1; k++) {
            for (var l = j-1; l <= j+1; l++) {
              // check is adjecent cell is within bounds
              if (k >= 0 && l >= 0 && k < this.num_rows && l < this.num_cols) {
                if (this.board[k][l] == "M") {
                  cur_mines++;
                }
              }
            }
          }

          this.board[i][j] = cur_mines;
        }
      }
    }
  }



  /**
    * Displays game board in table
  */
  drawGameBoard() {
    // setting first click true
    this.first_click = true;
    // getting table
    var table = document.getElementById('table_game_board');

    // clearing table in case coming from a resetGame()
    $("#table_game_board tr").remove();

    // iterating through each row and each cell of the gameboard
    // creating new rows and new cells for each element
    // setting cell value equal to game board value at that index
    for (var i = 0; i < this.board.length; i++) {
      var new_row = table.insertRow(i);
      for (var j = 0; j < this.board[0].length; j++) {
        var new_cell = new_row.insertCell(j);
        var current_row = table.rows[i];
        var current_cell = current_row.cells[j];
        current_cell.setAttribute('row', i);
        current_cell.setAttribute('col', j);
        current_cell.setAttribute('value', this.board[i][j]);
        current_cell.setAttribute('flagged', false);
        current_cell.setAttribute('isDisplayed', false);
        current_cell.innerHTML = "<div class='content'></div>";
      }
    }

    // reset flag counts and display
    this.flag_count = 0;
    this.flagged_mines = 0;
    this.updateFlagDisplay();

    // reset percent-completed bar
    this.percent_bar.resetBar();

    // make all of the cells square, based on their widths
    var cell_size = $('#modal_game_board td .content').width();
    $('#modal_game_board td').css("font-size", (cell_size/1.5) + "px");
  }



  /**
    * Updates flag count according to operation
    * @param {String} operation - increment or decrement flag count
    * @param {Object} cell - DOM object of the cell that was flagged
  */
  updateFlagCount(operation, cell) {
    if (operation == "increment") {
      this.flag_count++;
      this.percent_bar.increaseProgress();
      if(cell.getAttribute('value') == "M"){
        this.flagged_mines++;
      }
    }
    else if (operation == "decrement") {
      this.flag_count--;
      this.percent_bar.decreaseProgress();
      if(cell.getAttribute('value') == "M")
      {
        this.flagged_mines--;
      }
    }

    this.updateFlagDisplay();
  }



  /**
    * sets flag indicator above game board to remaining number of flags
    */
  updateFlagDisplay(){
    document.getElementById('flag_count').innerHTML = this.mine_count - this.flag_count;
  }



  /**
    * Function to trigger with each on click.
    * Checks if the user has statisfied every condition to win the game.
    * Returns true if user has flagged all mines.
    @returns {Boolean}
  */
  checkWin()
  {
    return (this.mine_count == this.flagged_mines);
  }



  /**
   * Calls displayValue() to show cell values and then handles the rules
   * when telling what other cells will need to be cleared due to game rules
   * @param {Object} cell - DOM object of the cell that was clicked
   * @returns {Boolean} - true if this click caused game lose condition
   */
  cellClicked(cell) {

    // if cell value is flagged, immediately return false because click shouldn't register
    if(cell.getAttribute('flagged') == 'true'){
      return false;
    }

    //If Cell Value is mine
    if(cell.getAttribute('value') == "M")
    {
      // user lost, return true
      return true;
    }

    // otherwise display cell and any relevant adjacent ones
    this.recReveal(cell.getAttribute('row') , cell.getAttribute('col'))
    return false;

  };



  /**
   * Recursively reveals the the cell at (i, j) and any adjacent cells, if applicable
   * @param {Number} i - row index of current cell
   * @param {Number} j - column index of current cell
   */
  recReveal(i, j) {
    // check if (i, j) is within board
    if(parseInt(i, 10) < this.board.length && parseInt(j, 10) < this.board[0].length && parseInt(i, 10) >= 0 && parseInt(j, 10) >= 0) {
      //Get Cell at i,j
      var table = document.getElementById('table_game_board');
      var row = table.rows[i];
      var cell = row.cells[j];

      // don't do anything if the cell is already displayed or flagged
      if(cell.getAttribute('isDisplayed') == "false" && cell.getAttribute('flagged') == "false") {
        if(cell.getAttribute('value') == "0") {
          this.displayValue(cell);

          //Look in all directions
          this.recReveal(i,parseInt(j, 10) + 1);
          this.recReveal(parseInt(i, 10) + 1,parseInt(j, 10) + 1);
          this.recReveal(parseInt(i, 10) + 1,j);
          this.recReveal(parseInt(i, 10) + 1,parseInt(j, 10) - 1);
          this.recReveal(i,parseInt(j, 10) - 1);
          this.recReveal(parseInt(i, 10) - 1,parseInt(j, 10) - 1);
          this.recReveal(parseInt(i, 10) - 1,j);
          this.recReveal(parseInt(i, 10) - 1,parseInt(j, 10) + 1);
        }
        else {
          this.displayValue(cell);
        }
      }
    }
  }



  /**
   * Displays the cell value on the game_board
   * @param {Object} cell - DOM object of the cell that was clicked
   */
  displayValue(cell)
  {
    var value = cell.getAttribute('value');
    cell.setAttribute('isDisplayed', true);
    if(value != "0"){
      cell.firstChild.innerHTML = cell.getAttribute('value');
    }
    cell.style.color = this.color_enum[value];
    cell.style.backgroundColor = "silver";

    this.percent_bar.increaseProgress();
  }



  /**
    * toggles flagged status of a cell
    * @param {Object} cell - DOM object of the cell that was clicked
  */
  cellFlagged(cell) {
    // cell is currently flagged
    if (cell.getAttribute('flagged') == 'true') {
      cell.setAttribute('flagged', 'false');
      cell.setAttribute('background', "");
      this.updateFlagCount("decrement", cell);
    } else {
      // cell is not currently flagged
      // toggle only if user has flags left
      if (this.mine_count > this.flag_count) {
        // check that an actual cell was clicked
        if(cell.tagName == "TD")
        {
          cell.setAttribute('flagged', 'true');
          cell.setAttribute('background', "/images/flag.png");
          this.updateFlagCount("increment", cell);
        }
      }

    }
  }
}
