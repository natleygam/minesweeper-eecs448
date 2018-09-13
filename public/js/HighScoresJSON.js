/**
 * id of highscore json from myJSON
 * @type {String}
 */
var myjson_id = "rw7kg";

/**
 * allows for interaction with myjson high score file
 */
class HighScoresJSON{

  constructor(){
    // stores latest JSON object pulled
    this.latest;
    // if a good return status was received from json server on last call
    this.good_status = false;
    // time JSON was last pulled
    this.last_pulled;
  }

  /**
   * adds a score to the local scores copy
   * @param {String} name - name of player who is submitting score
   * @param {Number} rows - number of rows in board used
   * @param {Number} cols - number of columns in board used
   * @param {Number} mines - number of mines in board used
   * @param {String} time - time board was completed in
   * @param {Number} percent - % of board completed
   */
  addScore(name, rows, cols, mines, time, percent){

    // check if row, col, and mine keys exist
    if(this.latest[rows] == null){
      this.latest[rows] = {};
    }
    if(this.latest[rows][cols] == null){
      this.latest[rows][cols] = {}
    }
    if(this.latest[rows][cols][mines] == null){
      this.latest[rows][cols][mines] = []
    }

    // create data object
    var add_data = {'name': name, 'time': time, 'percent': percent};
    var index = 0;

    // iterate through JSON object until we find the location this score should
    // be placed in - sorted first by percent (descending) then time (ascending)
    while(index < this.latest[rows][cols][mines].length && !(percent > Number(this.latest[rows][cols][mines][index].percent) || (time < this.latest[rows][cols][mines][index].time && percent == Number(this.latest[rows][cols][mines][index].percent)))) {
      index++;
    }

    // insert the new score, if score cap not reached
    if(index < 100){
      this.latest[rows][cols][mines].splice(index, 0, add_data);
    }

  }

  /**
   * push local scores copy to myjson
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
          console.log("AJAX call failed: myJSON error");
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

  /**
   * get scores from the local score copy based on variables
   * @param {Number} rows - number of rows in board used
   * @param {Number} cols - number of columns in board used
   * @param {Number} mines - number of mines in board used
   * @param {Number} start_index - index of first score to return
   * @param {Number} count - max number of scores to return
   * @returns {Object} returns the status of local copy and the requested data
   */
  getScores(rows, cols, mines, start_index, count){

    if(!this.good_status){
      return {'good_status': false};
    }

    if(this.latest[rows] != null){
      if(this.latest[rows][cols] != null){
        if(this.latest[rows][cols][mines] != null){
          return {'good_status': true, 'data': this.latest[rows][cols][mines].slice(start_index, start_index+count)};
        }
      }
    }

    return {'good_status': true, 'data': []};

  }

  /**
   * get number of scores that have the given criteria
   * @param {Number} rows - number of rows in board used
   * @param {Number} cols - number of columns in board used
   * @param {Number} mines - number of mines in board used
   * @returns {Number}
   */
  getNumScores(rows, cols, mines){

    if(this.latest[rows] != null){
      if(this.latest[rows][cols] != null){
        if(this.latest[rows][cols][mines] != null){
          return this.latest[rows][cols][mines].length;
        }
      }
    }

    return 0;

  }

}
