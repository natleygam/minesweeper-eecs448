class PercentBar{

  constructor(segments){
    this.segments = segments;
    this.segment_arr = [];
  }

  resetBar(){
    var bar = document.getElementById('percent_complete');

    // clearing table in case coming from a resetGame()
    $("#percent_complete tr").remove();
    this.segment_arr = [];

    var new_row = bar.insertRow(0);
    for (var j = 0; j < this.segments; j++) {
      var new_cell = new_row.insertCell(j);
      this.segment_arr.push(new_cell);
    }
  }

}
