class GameManager {
  // object properties
  constructor() {
    /**
     * instance of stopwatch for timing games
     * @type {Stopwatch}
     */
    this.stopwatch = new Stopwatch();

    /**
     * @type {GameBoard}
     */
    this.board = new GameBoard();

    /**
     * @type {ModalManager}
     */
    this.modal_manager = new ModalManager();
  }

  // object methods
  /**
    * Calls modal to get game config
  */
  getConfig() {
    // resetting stopwatch in case coming from game lose modal
    this.stopwatch.reset();
    // calls function to ready config modal
    this.modal_manager.operationConfig();
  }

  /*
    * Ensures board_rows, board_cols, and mine_count is in proper format
    * Presents modal if in bad format
    * Calls this.board.buildGame() if in good format
  */
  validateConfig() {
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
      this.board.buildGameBoard(board_rows, board_cols, mine_count);
      // call function to ready game start modal
      this.modal_manager.operationGameStart();
      // set the initial mine count
      this.board.initialMineCount(mine_count);
      // set the initial flag count
      var flag_count = mine_count;
      this.board.initialFlagCount(flag_count);
    }
  }

  /**
    * Dismisses start game modal
    * Calls function to display game board
  */
  startGame() {
    // call function to ready game board modal
    this.modal_manager.operationGameBoard();
    // display gameboard
    this.board.displayGameBoard();
  }

  /**
    * Resets game with current settings by re-presenting game board modal
    * Resets stopwatch
    * Presents snackbar upon completion
  */
  resetGame() {
    // calls function to run reset operations for modals
    this.modal_manager.operationReset();
    // resetting stopwatch
    this.stopwatch.reset();
    // resetting flag count
    this.board.initialFlagCount(this.board.initial_flag_count);
    // building new board with current config
    this.board.buildGameBoard(this.board.num_rows, this.board.num_cols, this.board.initial_mine_count);
    // displaying gameboard again
    this.board.displayGameBoard(this.board.initial_board);
    // present snackbar alerting user that reset was successful
    $.snackbar({content: "Game reset!"});
  }
}
