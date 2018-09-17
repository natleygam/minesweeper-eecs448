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
      status: false
    };
    // stores latest JSON object pulled
    this.latest;
    // if a good return status was received from json server on last call
    this.good_status = false;
    // time JSON was last pulled
    this.last_pulled;
  }



  /**
    * Adds queued user score to high scores, then calls pushScores
  */
  addScore() {
    if(this.user_high_score.status){

      // build score object
      const score_listing = {
        user_name: document.getElementById('input_high_score_name').value,
        user_score: this.user_high_score.score
      };

      // insert into local copy of scores at specified index
      this.latest[this.user_high_score.preset_index].scores.splice(this.user_high_score.score_index, 0, score_listing);
      // kick last score off if we've reached 10 (max number)
      if(this.latest[this.user_high_score.preset_index].scores.length > 10){
        this.latest[this.user_high_score.preset_index].scores.pop();
      }

      // disable submit button so it can't be pressed again
      document.getElementById('submit_score').setAttribute('disabled', true);

      // call push scores
      $.when(this.pushScores()).done(
        () => {

          // reset stored high score
          this.user_high_score = {
            status: false
          };

          // present snackbar alerting user that submission was successful
          $.snackbar({content: "Highscore submitted!"});
        }
      ).fail(
        (information) => {
          // present snackbar alerting user that submission was unsuccessful
          $.snackbar({content: "Error sending scores: " + information});

          // enable submit button so user can try again
          document.getElementById('submit_score').setAttribute('disabled', true);
        }
      )
    }
  }



  /**
   * Push local scores copy to myjson.
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
          callback.resolve();
        }
        else{
          callback.reject("myJSON error");
        }
      }
    ).fail(
      (jqXHR, textStatus, information) => {
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
    * @return {Promise} resolved with a boolean indicating whether or not the user earned a high score
  */
  checkIfHighScore(score, preset_index) {
    // check to see if user is using board size for high score
    if (preset_index != undefined) {
      // retrieve high scores for preset board size
      var callback = $.Deferred();

      $.when(this.pullScores()).done(
        () => {
          // find index in scores list where this score would be inserted
          var ind = 0;
          while(ind < this.latest[preset_index]["scores"].length && score >= this.latest[preset_index]["scores"][ind].user_score){
            ind++;
          }

          // if within max cap of scores (10), queue score
          if(ind < 10){
            this.user_high_score = {
              status: true,
              preset_index: preset_index,
              score_index: ind,
              score: score
            };
            callback.resolve(true);
          }
          else{
            // otherwise, resolve with false
            this.user_high_score = {
              status: false
            };
            callback.resolve(false);
          }
        }
      ).fail(
        (information) => {
          callback.reject(information);
        }
      )

      return callback.promise();

    } else {
      // user did not have a preset
      return $.Deferred().resolve(false);
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
          callback.reject("myJSON error");
        }
      }
    ).fail(
      (jqXHR, textStatus, information) => {
        callback.reject(information);
      }
    )
    return callback.promise();

  }



  // administrative function - clears myJSON file.
  // shouldn't be called, generally
  resetScores(){

    var callback = $.Deferred();

    this.latest = [
                    {
                      "board_size": "8x8 (10)",
                      "scores": []
                    },
                    {
                      "board_size": "16x16 (40)",
                      "scores": []
                    },
                    {
                      "board_size": "16x30 (99)",
                      "scores": []
                    }
                  ];

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
