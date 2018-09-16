/**
 * class for interacting with percent bar below game board
 */
class PercentBar{

  /**
   * @param {Number} cells - the number of cells in the gameboard this percent bar is associated with
   */
  constructor(cells){
    this.cells = cells;
    this.cur_done = 0;
    this.prog_bar = document.getElementById("prog_bar");
  }

  /**
   * sets currently done percentage to 0 and updates progress bar.
   */
  resetBar(){
    this.cur_done = 0;
    this.updateDisplay()
  }

  /**
   * increases the displayed progress by one cell
   */
  increaseProgress(){
    this.cur_done++;
    this.updateDisplay()
  }

  /**
   * decreses the displayed progress by one cell
   */
  decreaseProgress(){
    this.cur_done--;
    this.updateDisplay()
  }

  /**
   * calculates the current percentage done, and displays it as text and as width of progress bar
   */
  updateDisplay(){
    var perc = Math.round(100*this.cur_done/this.cells) + "%";
    this.prog_bar.innerHTML = perc;
    this.prog_bar.style.width = perc;
  }

}
