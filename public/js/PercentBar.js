class PercentBar{

  constructor(segments){
    this.segments = segments;
    this.cur_done = 0;
    this.prog_bar = document.getElementById("prog_bar");
  }

  resetBar(){

    this.prog_bar.innerHTML = "0%";
    this.prog_bar.style.width = "0%";
    //this.prog_bar.setAttribute('aria-valuenow', 0);

    // var bar = document.getElementById('percent_complete');
    //
    // // clearing table in case coming from a resetGame()
    // $("#prog_bar").remove();
    // this.segment_arr = [];
    // this.cur_done = 0;
    //
    // var new_row = bar.insertRow(0);
    // for (var j = 0; j < this.segments; j++) {
    //   var new_cell = new_row.insertCell(j);
    //   this.segment_arr.push(new_cell);
    //   new_cell.style.height = "1vh";
    // }
  }

  increaseProgress(){
    this.cur_done++;
    var perc = Math.round(100*this.cur_done/this.segments) + "%";
    this.prog_bar.innerHTML = perc;
    this.prog_bar.style.width = perc;
  }

  decreaseProgress(){
    this.cur_done--;
    var perc = Math.round(100*this.cur_done/this.segments) + "%";
    this.prog_bar.innerHTML = perc;
    this.prog_bar.style.width = perc;
  }

}
