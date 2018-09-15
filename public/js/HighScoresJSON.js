/**
 * id of highscore json from myJSON
 * @type {String}
 */
var myjson_id = "aqthk";

/**
 * allows for interaction with myjson high score file
 */
class HighScoresJSON{

  constructor(){
    // object for user high score during run time
    this.user_high_score = {
      status: false,
      preset_index: -1,
      score_index: -1,
      score: ""
    };
    // stores latest JSON object pulled
    this.latest;
    // if a good return status was received from json server on last call
    this.good_status = false;
    // time JSON was last pulled
    this.last_pulled;
  }

  /**
    * Adds user score to high scores locally
    * Calls push scores
  */
  addScore() {
    // build score object
    const score_listing = {
      user_name: document.getElementById('input_high_score_name').value,
      user_score: this.user_high_score.score
    };
    // insert into local copy of scores at specified index
    this.latest[this.user_high_score.preset_index].scores.splice(this.user_high_score.score_index, 0, score_listing);
    // call push scores
    this.pushScores();
  }

  /**
   * push local scores copy to myjson
   * resets high score state variables
   * @returns {Promise} resolved when response is received from myjson server
   */
  pushScores(){

    var callback = $.Deferred();

    // send ajax request to myjson server with current JSON object
    $.when($.ajax({
      url:"https://api.myjson.com/bins/" + myjson_id,
      type: "PUT",
      data: JSON.stringify(this.latest),
      contentType: "application/json; charset=utf-8",
      dataType: "json"
    })).done(
      (data, textStatus, jqXHR) => {
        if(textStatus == "success"){
          this.last_pulled = new Date();
          this.user_high_score = {
            status: false,
            index: -1,
            score: ""
          };
          // present snackbar alerting user that submission was successful
          $.snackbar({content: "Highscore submitted!"});
          callback.resolve();
        }
        else{
          console.log("AJAX call failed: myJSON error");
          // present snackbar alerting user that submission was unsuccessful
          $.snackbar({content: "AJAX call failed: myJSON error"});
          callback.reject("myJSON error");
        }
      }
    ).fail(
      (jqXHR, textStatus, information) => {
        console.log("AJAX call failed: " + information);
        callback.reject(information);
      }
    )

    return callback.promise();

  }

  /**
   * gets raw json from myjson
   * @returns {Promise}
   */
  getJSON(){
    return $.get("https://api.myjson.com/bins/" + myjson_id);
  }

  /**
    * Determines if user has earned a high score to spec of board preset (if any)
    * @param {String} score - the score the user has earned
    * @param {Number} preset_index - the index of the preset the user has selected (if any)
    * @return {Bool} is_high_score - whether or not the user has earned a high score
  */
  checkIfHighScore(score, preset_index) {
    // check to see if user is using board size for high score
    if (preset_index != undefined) {
      // retrieve high scores for preset board size
      var callback = $.Deferred();
      $.when(this.pullScores()).done(
        () => {
          var sorted_scores = this.latest[preset_index]["scores"].sort(function(a, b) {
            if (a.user_score < b.user_score)
              return -1;
            if (a.user_score > b.user_score)
              return 1;
            return 0;
          });
          // set sorted scores equal to local copy
          this.latest[preset_index]["scores"] = sorted_scores;
          // determine is user has earned a high score, only care about if top 10 scores
          for (var j = 0; j < sorted_scores.length; j++) {
            if (j < 10) {
              // user earned high score
              if (score < sorted_scores[j].user_score) {
                this.user_high_score.status = true;
                this.user_high_score.preset_index = preset_index;
                this.user_high_score.score_index = j;
                this.user_high_score.score = score;
                console.log('returning true');
                return true;
              } else if (j == 9) {
                // user did not beat other scores but is in top 10
                this.user_high_score.status = true;
                this.user_high_score.preset_index = preset_index;
                this.user_high_score.score_index = j;
                this.user_high_score.score = score;
                return true;
              }
            }
          }
          // user did not earn high score
          if (this.user_high_score.status == false) {
            return false;
          }
        }
      ).fail(
        (information) => {
          callback.reject(information);
        }
      )
    } else {
      // user did not have a preset
      return false;
    }
  }

  /**
   * pulls scores from myjson and updates status variables
   * @returns {Promise}
   */
  pullScores(){

    var callback = $.Deferred();

    $.when(this.getJSON()).done(
      (data, textStatus, jqXHR) => {
        if(textStatus == "success"){
          this.latest = data;
          this.good_status = true;
          this.last_pulled = new Date();
          callback.resolve();
        }
        else{
          console.log("AJAX call failed: myJSON error");
          callback.reject("myJSON error");
        }
      }
    ).fail(
      (jqXHR, textStatus, information) => {
        console.log("GET call failed: " + information);
        callback.reject(information);
      }
    )
    return callback.promise();

  }

  /**
   * administrative function - clears myJSON file.
   * shouldn't be called, generally
   * @returns {Promise}
   */
  resetScores(){

    var callback = $.Deferred();

    this.latest = {};

    $.when(this.pushScores()).done(
      callback.resolve()
    ).fail(
      (information) => callback.reject(information)
    )

    return callback.promise();

  }

  // /**
  //  * get scores from the local score copy based on variables
  //  * @param {Number} rows - number of rows in board used
  //  * @param {Number} cols - number of columns in board used
  //  * @param {Number} mines - number of mines in board used
  //  * @param {Number} start_index - index of first score to return
  //  * @param {Number} count - max number of scores to return
  //  * @returns {Object} returns the status of local copy and the requested data
  //  */
  // getScores(rows, cols, mines, start_index, count){
  //
  //   if(!this.good_status){
  //     return {'good_status': false};
  //   }
  //
  //   if(this.latest[rows] != null){
  //     if(this.latest[rows][cols] != null){
  //       if(this.latest[rows][cols][mines] != null){
  //         return {'good_status': true, 'data': this.latest[rows][cols][mines].slice(start_index, start_index+count)};
  //       }
  //     }
  //   }
  //
  //   return {'good_status': true, 'data': []};
  //
  // }
  //
  // /**
  //  * get number of scores that have the given criteria
  //  * @param {Number} rows - number of rows in board used
  //  * @param {Number} cols - number of columns in board used
  //  * @param {Number} mines - number of mines in board used
  //  * @returns {Number}
  //  */
  // getNumScores(rows, cols, mines){
  //
  //   if(this.latest[rows] != null){
  //     if(this.latest[rows][cols] != null){
  //       if(this.latest[rows][cols][mines] != null){
  //         return this.latest[rows][cols][mines].length;
  //       }
  //     }
  //   }
  //
  //   return 0;
  //
  // }

}
