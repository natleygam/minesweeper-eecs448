/**
 * Controls game state - switches between config and game, etc.
 * Sends commands to stopwatch, modal manager, high scores objects.
 * Also creates and manages game boards.
 */
class GameManager {

  constructor() {

    // instance of stopwatch for timing games
    this.stopwatch = new Stopwatch();

    // stores current game board object
    this.board;

    // creates modal manager object
    this.modal_manager = new ModalManager();

    // creates direct high scores interaction object
    this.json_caller = new HighScoresJSON();

    // creates manager for viewing high scores
    this.hs_viewer = new HighScoresViewer();
  }



  /**
    * Initializes game board for requested preset.
    * Calls this.board.buildGameBoard() and begins game operations.
    * @param {Number} preset_index - index of requested preset (0, 1, or 2)
  */
  presetConfig(preset_index) {
    var board_rows, board_cols, mine_count;
    if (preset_index == 0) {
      board_rows = 8;
      board_cols = 8;
      mine_count = 10;
    } else if (preset_index == 1) {
      board_rows = 16;
      board_cols = 16;
      mine_count = 40;
    } else if (preset_index == 2) {
      board_rows = 16;
      board_cols = 30;
      mine_count = 99;
    }

    // create new instance of game board
    this.board = new GameBoard(board_rows, board_cols, mine_count, preset_index);
    // build game board upon good config
    this.board.buildGameBoard();
    // call function to ready game start modal
    this.modal_manager.operationGameStart();
  }


  /**
    * Resets stopwatch and calls modal to get game config
  */
  getConfig() {
    // resetting stopwatch in case coming from game lose modal
    this.stopwatch.reset();
    // calls function to ready config modal
    this.modal_manager.operationConfig();
  }



  /*
    * Ensures board_rows, board_cols, and mine_count is in proper format.
    * Presents modal if in bad format.
    * Calls this.board.buildGame() if in good format.
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
    if (board_rows == "" || board_rows < 2 || board_rows > 50) {
      bad_board_size = true;
    }
    if (board_cols == "" || board_cols < 2 || board_cols > 50) {
      bad_board_size = true;
    }
    if (mine_count == "" || mine_count < 1 || mine_count > ((board_rows * board_cols)-1)) {
      bad_mine_count = true;
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
      // adjust table class for board size
      if (board_cols > 8) {
        document.getElementById('table_game_board').setAttribute('class', 'table table-bordered table-responsive bg-secondary');
      } else new Promise(function(resolve, reject) {
        document.getElementById('table_game_board').setAttribute('class', 'table table-bordered bg-secondary');
      });
      // create new instance of game board
      this.board = new GameBoard(board_rows, board_cols, mine_count);
      // build game board upon good config
      this.board.buildGameBoard();
      // call function to ready game start modal
      this.modal_manager.operationGameStart();
    }
  }



  /**
   * Hides start game, win game, and lose game modals.
   * Resets stopwatch.
   * Builds and displays new game board.
   */
  newGame(){

    this.modal_manager.operationReset();
    // resetting stopwatch
    this.stopwatch.reset();
    // building new board with current config
    this.board.buildGameBoard();
    // displaying gameboard again
    this.modal_manager.gameBoardModal('show');
    this.board.drawGameBoard();

    $.snackbar({content: "New game ready!"});

  }



  /**
   * helper function - if this was a first click, then start the Stopwatch
   */
  checkFirstClick(){
    if (this.board.first_click == true) {
      // start stopwatch
      this.stopwatch.run();
      this.board.first_click = false;
    }
  }



  /**
    * Stops stopwatch.
    * Gets time.
    * Updates score label on win game modal.
    * Calls function to determine if user earned high score.
    * Presents win game modal depending on if a high score was earned.
  */
  winGame() {
    this.stopwatch.stop();
    const score = this.stopwatch.getTime();
    document.getElementById('win_time').innerHTML = score;
    // enable submit button
    document.getElementById('submit_score').removeAttribute('disabled');

    // wait for caller to pull highscores from myJSON and check if a hs was earned
    $.when(this.json_caller.checkIfHighScore(score, this.board.preset_index)).done(
      (hs_state) => {
        // show win game modal based on if a high score was earned or not
        this.modal_manager.gameWinModal('show', hs_state);
      }
    ).fail(
      (information) => {
        // bad thing happened.
        // present snackbar alerting user
        $.snackbar({content: "Error getting scores: " + information});
        // by default
        this.modal_manager.gameWinModal('show', false);
      }
    )
  }



  /**
    * Presents lose game modal
  */
  loseGame() {
    this.modal_manager.gameLoseModal('show');
  }



  /**
   * presents high score modal
   * @param {Number} [preset_index=this.board.preset_index] - initial index to open high scores with
   */
  showHighScores(preset_index) {

    preset_index = (preset_index == undefined ? this.board.preset_index : preset_index);

    $.when(this.hs_viewer.initialize(preset_index)).done(
      () => {
        this.modal_manager.highScoreModal('show');
      }
    ).fail(
      (information) => {
        // present snackbar alerting user that submission was unsuccessful
        $.snackbar({content: "Error getting scores: " + information});
      }
    )

  }



  /**
   * hides high score modal
   */
  hideHighScores() {
    this.modal_manager.highScoreModal('hide');
  }
}
