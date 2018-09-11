/**
 * allows for interaction with myjson high score file
 */
class HighScoreManager{

  constructor(){
    this.myjson_id = "rw7kg";
    this.latest;
    this.good_status = false;
    this.last_pulled;
  }

  // adds a score to the local scores copy
  addScore(name, rows, cols, mines, time, percent){

    if(this.latest[rows] == null){
      this.latest[rows] = {};
    }
    if(this.latest[rows][cols] == null){
      this.latest[rows][cols] = {}
    }
    if(this.latest[rows][cols][mines] == null){
      this.latest[rows][cols][mines] = []
    }

    var add_data = {'name': name, 'time': time, 'percent': percent};
    var index = 0;

    while(index < this.latest[rows][cols][mines].length && (time >= this.latest[rows][cols][mines][index].time || percent >= this.latest[row][cols][mines][index].percent)){
      index++;
    }

    this.latest[rows][cols][mines].splice(index, 0, add_data);

    console.log(this.latest);
  }

  // push local scores copy to myjson
  pushScores(){

    var callback = $.Deferred();

    $.when($.ajax({
      url:"https://api.myjson.com/bins/" + this.myjson_id,
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

  // gets raw json from myjson
  getJSON(){
    return $.get("https://api.myjson.com/bins/" + this.myjson_id);
  }

  // pulls scores from myjson and updates status variables
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

  // get scores from the local score copy based on variables
  getScores(rows, cols, mines, start_index, end_index){

    if(!this.good_status){
      return {'good_status': false};
    }

    if(this.latest[rows] != null){
      if(this.latest[rows][cols] != null){
        if(this.latest[rows][cols][mines] != null){
          return {'good_status': true, 'data': this.latest[rows][cols][mines].slice(start_index, end_index)};
        }
      }
    }

    return {'good_status': true, 'data': []};

  }

  // get number of scores that have the given criteria
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
