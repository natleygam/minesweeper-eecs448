class PercentBar{

  constructor(cells){
    this.cells = cells;
    this.cur_done = 0;
    this.prog_bar = document.getElementById("prog_bar");
  }

  resetBar(){
    this.cur_done = 0;
    this.updateDisplay()
  }

  increaseProgress(){
    this.cur_done++;
    this.updateDisplay()
  }

  decreaseProgress(){
    this.cur_done--;
    this.updateDisplay()
  }

  updateDisplay(){
    var perc = Math.round(100*this.cur_done/this.cells) + "%";
    this.prog_bar.innerHTML = perc;
    this.prog_bar.style.width = perc;
  }

}
