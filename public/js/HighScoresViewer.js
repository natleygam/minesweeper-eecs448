/**
 * manages functions related to high score modal and displaying high scores
 */
class HighScoresViewer{

  constructor(){
    // create myJSON wrapper
    this.json_caller = new HighScoresJSON();
  }

  /**
   * Pulls scores from server, then calls displayScores()
   * to initialize table information when the high score modal is opened.
   * @param {Number} [preset_index=0] - initial index to open high scores with
   * @return {Promise}
   */
  initialize(preset_index){

    preset_index = (preset_index == undefined ? 0 : preset_index);

    var callback = $.Deferred();

    $.when(this.json_caller.pullScores()).done(
      () => {
        this.displayScores(preset_index);
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
   * update scores from the local JSON copy
   * @param {Number} preset_index - which preset to display scores for (0, 1, 2)
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
