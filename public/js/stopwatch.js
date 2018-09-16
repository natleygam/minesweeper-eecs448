/**
  * Definition of stopwatch object
*/
class Stopwatch {

  constructor() {
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    this.watch;
  }



  /**
    * tells stopwatch to begin counting
  */
  run() {
    this.watch = setTimeout(this.increment.bind(this), 1000);
  }



  /**
    * Increments properties of stopwatch
  */
  increment() {
    this.seconds++;
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
      if (this.minutes >= 60) {
        this.minutes = 0;
        this.hours++;
      }
    }

    // update label
    var label = document.getElementById('label_stopwatch')
    label.innerHTML = '';
    if (this.hours > 9) {
      label.innerHTML += this.hours + ':';
    } else {
      label.innerHTML += '0' + this.hours + ':';
    }
    if (this.minutes > 9) {
      label.innerHTML += this.minutes + ':';
    } else {
      label.innerHTML += '0' + this.minutes + ':';
    }
    if (this.seconds > 9) {
      label.innerHTML += this.seconds;
    } else {
      label.innerHTML += '0' + this.seconds;
    }

    // call function to continue stopwatch
    this.run();
  };



  /**
    * directly set time of stopwatch
    * @param {Number} seconds - number of seconds to display
    * @param {Number} minutes - number of minutes to display
    * @param {Number} hours - number of hours to display
  */
  setIncrement(seconds, minutes, hours) {
    this.seconds = seconds;
    this.minutes = minutes;
    this.hours = hours;
  }



  /**
    * Haults increment of stopwatch by clearing timeout
    * Does not reset object properties
  */
  stop() {
    clearTimeout(this.watch);
  }



  /**
    * Clears set timeout and resets stopwatch variables
    * Resets label to 00:00:00
  */
  reset() {
    clearTimeout(this.watch);
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;

    var label = document.getElementById('label_stopwatch')
    label.innerHTML = '00:00:00';
  };



  /**
    * Formats time as standard HH:MM:SS
    * Returns time
  */
  getTime() {
    var time = "";
    if (this.hours < 10) {
      time += "0" + this.hours;
    } else {
      time += this.hours;
    }
    time += ":";
    if (this.minutes < 10) {
      time += "0" + this.minutes;
    } else {
      time += this.minutes;
    }
    time += ":";
    if (this.seconds < 10) {
      time += "0" + this.seconds;
    } else {
      time += this.seconds;
    }

    return time;
  }
}
