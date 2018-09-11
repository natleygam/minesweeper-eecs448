/**
  * Definition of game board object
*/
class GameBoard {

  // object properties
  constructor(num_rows, num_cols, initial_mine_count) {
    this.initial_board;
    this.board;
    this.num_rows = num_rows;
    this.num_cols = num_cols;
    this.initial_mine_count = initial_mine_count;
    this.current_mine_count = 0;
    this.initial_flag_count = initial_mine_count;
    this.current_flag_count = initial_mine_count;
    this.current_flaged_mine_count = 0;
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

  // object methods

  /**
    * Builds game board to spec
    * Loops if not all mines used
    * Sets equal to initial_board and board upon successful use of all mines
    * @param {Number} board_rows - number of rows specified for board
    * @param {Number} board_cols - number of cols specified for board
    * @param {Number} mine_count - number of mines specified for board
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
    for(var i = 0; i < this.initial_mine_count; i++) {
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

    // set equal to initial board as well
    this.initial_board = this.board;
  }

  /**
    * Displays game board in table
  */
  displayGameBoard() {
    // setting first click true
    this.first_click = true;
    // getting table
    var table = document.getElementById('table_game_board');

    // clearing table in case coming from a resetGame()
    $("#table_game_board tr").remove();

    // iterating through each row and each cell of the gameboard
    // creating new rows and new cells for each element
    // setting cell value equal to game board value at that index
    for (var i = 0; i < this.initial_board.length; i++) {
      var new_row = table.insertRow(i);
      for (var j = 0; j < this.initial_board[0].length; j++) {
        var new_cell = new_row.insertCell(j);
        var current_row = table.rows[i];
        var current_cell = current_row.cells[j];
        current_cell.setAttribute('row', i);
        current_cell.setAttribute('col', j);
        current_cell.setAttribute('value', this.initial_board[i][j]);
        current_cell.setAttribute('flagged', false);
        current_cell.innerHTML = "<div class='content'></div>";
        //current_cell.style.fontSize = "40px";
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
    //$('#table_game_board td').height($('#table_game_board td').width());
    var cell_size = $('#modal_game_board td .content').width();
    $('#modal_game_board td').css("font-size", (cell_size/1.5) + "px");
  }

  /**
    * Updates mine count according to operation
    * @param {String} operation - increment or decrement mine count
  */
  updateMineCount(operation) {
    if (operation == "increment") {
      this.mine_count++;
    } else if (operation == "decrement") {
      this.mine_count--;
    }
  }

  /**
    * Sets initial flag count
    * @param {Number} initial_flag_count - value to be set as initial flag count
  */
  initialFlagCount(initial_flag_count) {
    this.initial_flag_count = initial_flag_count;
    this.current_flag_count = this.initial_flag_count;
    document.getElementById('flag_count').innerHTML = this.current_flag_count;
  }

  /**
    * Updates flag count according to operation
    * @param {String} operation - increment or decrement flag count
  */
  updateFlagCount(operation, cell) {
    if (operation == "increment") {
      this.current_flag_count++;
      if(cell.getAttribute('value') == "M")
      {
        this.current_flaged_mine_count--;
      }
    } else if (operation == "decrement") {
      this.current_flag_count--;
      if(cell.getAttribute('value') == "M")
      {
        this.current_flaged_mine_count++;
      }
    }
    document.getElementById('flag_count').innerHTML = this.current_flag_count;
  }

  /*
    * Function to trigger with each on click when number of flags = 0
    * That checks if the user has statisfied every condition to win the game
    * Returns true if user has flagged all mines
  */
  checkWin()
  {
    console.log("current mine count: " + this.initial_mine_count + "current flagged mines: " + this.current_flaged_mine_count);
    if(this.initial_mine_count == this.current_flaged_mine_count)
    {
      return(true);
    }
  }

  //Calls displayValue() to show cell values and then handles the rules
  //when telling what other cells will need to be cleared due to game rules
  cellClicked(cell) {
    console.log(cell);

    //If Cell Value is mine
    if(cell.getAttribute('value') == "M")
    {
      // user lost, return true
      return(true);
    }

    //If Cell Value is Not mine
    if(cell.getAttribute('value') != "M")
    {
      this.recReveal(cell.getAttribute('row') , cell.getAttribute('col'))
    }
  };

  /**
   * Recursively reveals the the cell at (i, j) and any adjacent cells, if applicable
   * @param {Number} i - row index of current cell
   * @param {Number} j - column index of current cell
   */
  recReveal(i, j)
  {
    if(parseInt(i, 10) < this.initial_board.length && parseInt(j, 10) < this.initial_board[0].length && parseInt(i, 10) >= 0 && parseInt(j, 10) >= 0)
    {
      //Get Cell at i,j
      var table = document.getElementById('table_game_board');
      var row = table.rows[i];
      var cell = row.cells[j];

      if(!cell.getAttribute('isDisplayed'))
      {
        if(cell.getAttribute('value') == "0" && cell.getAttribute('flagged') == "false")
        {
          console.log("value 0 found" + cell.getAttribute('row') + cell.getAttribute('col'));
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
        else if(cell.getAttribute('value') == "M")
        {
          // could be wrong, but I don't think this will ever occur, since
          // recReveal will only be initially called on non-mine cells from the
          // conditionals in cellClicked, and will only be called recursively
          // by cells that have no adjacent mines - Evan

        }
        else if(cell.getAttribute('flagged') == "false")
        {
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
    //var cellId = cell.getAttribute('row') + ',' + cell.getAttribute('col');
    //cell.setAttribute('id', cellId);
    var value = cell.getAttribute('value');
    cell.setAttribute('isDisplayed', true);
    if(value != "0"){
      cell.firstChild.innerHTML = cell.getAttribute('value');
    }
    cell.style.color = this.color_enum[value];
    cell.style.backgroundColor = "silver";
  }

  /**
    * toggles flagged status of a cell
    * @param {Object} cell - DOM object of the cell that was clicked
  */
  cellFlagged(cell) {
    // cell is currently flagged
    // toggle
    if (cell.getAttribute('flagged') == 'true') {
      cell.setAttribute('flagged', 'false');
      cell.setAttribute('background', "");
      this.updateFlagCount("increment", cell);
    } else {
      // cell is not currently flagged
      // toggle only if user has flags left
      if (this.current_flag_count > 0) {
        cell.setAttribute('flagged', 'true');
        cell.setAttribute('background', "/images/flag.png");
        this.updateFlagCount("decrement", cell);
        console.log("current flag amount after decrement: " + this.current_flag_count);
      }

    }
  }
}
