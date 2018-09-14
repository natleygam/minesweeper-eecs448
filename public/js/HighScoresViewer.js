/**
 * number of scores to display per high score page
 * @type {Number}
 */
var scores_per_page = 10;

/**
 * manages functions related to high score modal and displaying high scores
 */
class HighScoresViewer{

  /**
   * @param {HighScoresJSON} json_caller - instance of HighScoresJSON to use for myJSON interactions
   */
  constructor(json_caller){
    this.json_caller = json_caller;
  }

  /**
   * Calls displayScores() to initialize table information when the high score modal is opened
   * Calls with 0 preset index to begin with
   * Also updates JSON from server
   * @return {Promise}
   */
  initialize(){
    var callback = $.Deferred();

    $.when(this.json_caller.pullScores()).done(
      () => {
        this.displayScores(0);
        callback.resolve();
      }
    ).fail(
      (information) => {
        callback.reject(information);
      }
    )

    return callback.promise();

  }

  /**
   * update scores from the local JSON copy based on currently stored
   * rows, cols, mines, and page number
   */
  displayScores(preset_index) {
    // get table
    var table = document.getElementById("hs_table");
    // empty table
    $('#hs_table').empty();
    // initialize header
    var header = table.insertRow(0);
    header.setAttribute('class', 'bg-info');
    var rank = header.insertCell(0);
    var name = header.insertCell(1);
    var score = header.insertCell(2);
    rank.innerHTML = "Rank";
    name.innerHTML = "Name";
    score.innerHTML = "Score";

    // iterate through scores for given preset and present in table
    for (var i = 0; i < this.json_caller.latest[preset_index]["scores"].length; i++) {
      var new_row = table.insertRow(i + 1);
      var new_rank = new_row.insertCell(0);
      var new_name = new_row.insertCell(1);
      var new_score = new_row.insertCell(2);
      new_rank.innerHTML = (i + 1);
      new_name.innerHTML = this.json_caller.latest[preset_index]["scores"][i].user_name;
      new_score.innerHTML = this.json_caller.latest[preset_index]["scores"][i].user_score;
    }
  }
}
