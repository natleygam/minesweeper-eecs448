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
    // current row, column, mines values to use for queries
    this.rows_val;
    this.cols_val;
    this.mines_val;
    // current page to display
    this.cur_page = 1;

    // DOM elements of row, col, mines input boxes
    this.rows_elem = document.getElementById("hs_board_rows");
    this.cols_elem = document.getElementById("hs_board_cols");
    this.mines_elem = document.getElementById("hs_mine_count");

    // create high score table
    for(var i = 0; i < scores_per_page; i++){
      var new_row = document.getElementById('hs_table').insertRow(i+1);
      for(var j = 0; j < 4; j++){
        new_row.insertCell(j);
      }
      new_row.childNodes[0].style.backgroundColor = "royalblue";
    }
  }

  /**
   * gets the values currently in the input boxes and displays the first page of high scores for them
   */
  update_score_criteria(){
    this.rows_val = Number(this.rows_elem.value);
    this.cols_val = Number(this.cols_elem.value);
    this.mines_val = Number(this.mines_elem.value);

    this.set_page(1);
  }

  /**
   * manually sets the row, col, and mine values internally and in the input boxes
   * @param {Number} rows - number of rows to set
   * @param {Number} cols - number of columns to set
   * @param {Number} mines - number of mines to set
   */
  set_score_criteria(rows, cols, mines){
    this.rows_val = rows;
    this.rows_elem.value = rows;
    this.rows_elem.parentElement.className += " is-filled";

    this.cols_val = cols;
    this.cols_elem.value = cols;
    this.cols_elem.parentElement.className += " is-filled";

    this.mines_val = mines;
    this.mines_elem.value = mines;
    this.mines_elem.parentElement.className += " is-filled";
  }

  /**
   * initialize table information when the high score modal is opened
   * also updates JSON from server
   * @return {Promise}
   */
  initialize(){
    var callback = $.Deferred();

    this.set_score_criteria(8, 8, 10);

    $.when(this.json_caller.pullScores()).done(
      () => {
        this.set_page(1);
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
  display_scores(){
    var table = document.getElementById("hs_table");
    var scores = this.json_caller.getScores(this.rows_val, this.cols_val, this.mines_val, (this.cur_page-1)*scores_per_page, scores_per_page);
    for(var i = 0; i < scores.data.length; i++){
      table.childNodes[1].childNodes[i+2].childNodes[0].innerHTML = i+1+(this.cur_page-1)*scores_per_page;
      table.childNodes[1].childNodes[i+2].childNodes[0].setAttribute('class', 'bg-primary');
      table.childNodes[1].childNodes[i+2].childNodes[1].innerHTML = scores.data[i].name;
      table.childNodes[1].childNodes[i+2].childNodes[2].innerHTML = scores.data[i].time;
      table.childNodes[1].childNodes[i+2].childNodes[3].innerHTML = scores.data[i].percent + "%";
    }
    for(var i = scores.data.length; i < scores_per_page; i++){
      table.childNodes[1].childNodes[i+2].childNodes[0].innerHTML = i+1+(this.cur_page-1)*scores_per_page;
      for(var j = 1; j < 4; j++){
        table.childNodes[1].childNodes[i+2].childNodes[j].innerHTML = "";
      }
    }
  }

  /**
   * move to the next page of scores
   */
  next_page(){
    this.set_page(this.cur_page+1);
  }

  /**
   * move to the previous page of scores
   */
  prev_page(){
    this.set_page(this.cur_page-1);
  }

  /**
   * move to the given page number of scores
   * also enable/disable the previous/next page buttons based on the total
   * number of scores and the page being looked at
   */
  set_page(page_num){
    this.cur_page = page_num
    this.display_scores();
    if(page_num == 1){
      document.getElementById('prev_hs_page').setAttribute('disabled', true);
    }
    else{
      document.getElementById('prev_hs_page').removeAttribute('disabled');
    }
    if(this.json_caller.getNumScores(this.rows_val, this.cols_val, this.mines_val) <= page_num*scores_per_page){
      document.getElementById('next_hs_page').setAttribute('disabled', true);
    }
    else{
      document.getElementById('next_hs_page').removeAttribute('disabled');
    }
  }
}
