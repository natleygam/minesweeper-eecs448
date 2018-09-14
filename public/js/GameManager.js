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

    this.json_caller = new HighScoresJSON();

    this.hs_viewer = new HighScoresViewer(this.json_caller);
  }

  // object methods

  /**
    * Initializes for requested preset
    * Calls validate config when finished
    * @param {Number} preset_index - index of requested preset
  */
  presetConfig(preset_index) {
    if (preset_index == 0) {
      document.getElementById('input_board_rows').value = 8;
      document.getElementById('input_board_cols').value = 8;
      document.getElementById('input_mine_count').value = 10;
    } else if (preset_index == 1) {
      document.getElementById('input_board_rows').value = 16;
      document.getElementById('input_board_cols').value = 16;
      document.getElementById('input_mine_count').value = 40;
    } else if (preset_index == 2) {
      document.getElementById('input_board_rows').value = 16;
      document.getElementById('input_board_cols').value = 30;
      document.getElementById('input_mine_count').value = 99;
    }
    this.validateConfig();
  }
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
    // create new instance of game board
    this.board = new GameBoard(this.board.num_rows, this.board.num_cols, this.board.initial_mine_count);
    // building new board with current config
    this.board.buildGameBoard();
    // displaying gameboard again
    this.board.displayGameBoard(this.board.initial_board);
    // present snackbar alerting user that reset was successful
    $.snackbar({content: "Game reset!"});
  }

  /**
    * Stops stopwatch
    * Gets time
    * Updates score label on win game modal
    * Presents win game modal
  */
  winGame() {
    this.stopwatch.stop();
    const score = this.stopwatch.getTime();
    document.getElementById('win_time').innerHTML = score;

    // check to see if user is using board size for high score
    for (let i = 0; i < 3; i++) {
      // user is using accepted board size
      if (this.board.num_rows == (i + 1) * 8 && this.board.num_cols == (i + 1) * 8 ) {
        // retrieve high scores for that board size
        var callback = $.Deferred();
        $.when(this.json_caller.pullScores()).done(
          () => {
            var sorted_scores = this.json_caller.latest[0]["scores"].sort(function(a, b) {
              if (a.user_score < b.user_score)
                return -1;
              if (a.user_score > b.user_score)
                return 1;
              return 0;
            });
            // set sorted scores equal to local copy
            this.json_caller.latest[0]["scores"] = sorted_scores;
            // determine is user has earned a high score, only care about if top 10 scores
            for (var j = 0; j < sorted_scores.length; j++) {
              if (j < 10) {
                // user earned high score
                if (score < sorted_scores[j].user_score) {
                  this.json_caller.user_high_score.status = true;
                  this.json_caller.user_high_score.dimension_index = i;
                  this.json_caller.user_high_score.score_index = j;
                  this.json_caller.user_high_score.score = score;
                  // call win modal with high score flag true
                  this.modal_manager.gameWinModal('show', true);
                  break;
                } else if (j == 9) {
                  // user did not beat other scores but is in top 10
                  this.json_caller.user_high_score.status = true;
                  this.json_caller.user_high_score.dimension_index = i;
                  this.json_caller.user_high_score.score_index = j;
                  this.json_caller.user_high_score.score = score;
                  // call win modal with high score flag true
                  this.modal_manager.gameWinModal('show', true);
                  break;
                }
              }
            }
            // user did not earn high score
            if (this.json_caller.user_high_score.status == false) {
              this.modal_manager.gameWinModal('show', false);
            }
          }
        ).fail(
          (information) => {
            callback.reject(information);
          }
        )
      }
    }
    // user did not have specified board size
    this.modal_manager.gameWinModal('show', false);
  }

  /**
    * Presents lose game modal
  */
  loseGame() {
    this.modal_manager.gameLoseModal('show');
  }

  /**
   * presents high score modal
   */
  showHighScores() {
    this.hs_viewer.initialize();
    this.modal_manager.highScoreModal('show');
  }

  /**
   * hides high score modal
   */
  hideHighScores() {
    this.modal_manager.highScoreModal('hide');
  }
}
