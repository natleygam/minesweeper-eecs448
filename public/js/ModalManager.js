/**
 * provides functions for interacting with all the various modals.
 */
class ModalManager {

  constructor() {

  }



  /**
    * Manage config modal
    * @param {String} operation - hide or show modal
  */
  configModal(operation) {
    $('#modal_game_setup').modal(operation);
  }



  /**
    * Manage start game modal
    * @param {String} operation - hide or show modal
  */
  gameStartModal(operation) {
    $('#modal_start_game').modal(operation);
  }



  /**
    * Manage game board modal
    * @param {String} operation - hide or show modal
  */
  gameBoardModal(operation) {
    $('#modal_game_board').modal(operation);
  }



  /**
    * Manage game lose modal
    * @param {String} operation - hide or show modal
  */
  gameLoseModal(operation) {
    $('#modal_lose').modal(operation);
  }



  /**
    * Manage game win modal
    * @param {String} operation - hide or show modal
    * @param {Bool} isHighscore - whether or not user earned a high score`
  */
  gameWinModal(operation, isHighscore) {
    if (isHighscore) {
      document.getElementById('is_highscore').style.display = "block";
    } else {
      document.getElementById('is_highscore').style.display = "none";
    }
    $('#modal_win').modal(operation);
  }



  /**
   * manage high score modal
   * @param {String} operation - hide or show modal
   */
  highScoreModal(operation) {
    $('#modal_high_scores').modal(operation);
  }



  /**
    * Runs operations needed to ready config modal
  */
  operationConfig() {
    // hiding start game modal and game board modal in case coming from there
    this.gameBoardModal('hide');
    this.gameStartModal('hide');
    this.gameLoseModal('hide');
    this.gameWinModal('hide');
    // show games set up modal
    this.configModal('show');
  }



  /**
    * Runs operations needed to ready game start modal
  */
  operationGameStart() {
    // dismiss config modal
    this.configModal('hide');
    // show game start modal
    this.gameStartModal('show');
  }



  /**
    * Runs operations needed for game reset
  */
  operationReset() {
    this.gameStartModal('hide');
    this.gameLoseModal('hide');
    this.gameWinModal('hide');
  }
}
