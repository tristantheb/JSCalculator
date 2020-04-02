/**
 * @author tristantheb
 * @version 1.0.0
 */

document.addEventListener("DOMContentLoaded", function() {
  calc1 = calculatorFactory("#calculator1");
  calc1.init();
});

function calculatorFactory(cssId) {
  return {
    /**
     * @property {array} [buttonsList=[]] Get all the buttons of the calculator and register in the list
     * @property {number} [calcMemory=0] Create a global propery for the calculator memory, set to 0
     * @property {number} [calcValue=0] Create a global propery for the calculator result, set to 0
     * @property {number} [screen=0] Create a global propery for the calculator screen display, set to 0
     * @property {Screen} [screenElement={}] Get the screen element
     */
    buttonsList: [],
    calcMemory: 0,
    calcValue: 0,
    screen: 0,
    screenElement: {},
    /**
     * @method init Initializes the calculator and adds all callbacks
     */
    init() {
      let _this = this;
      // Select all buttons of the calculator and his screen
      this.buttonsList = document.querySelectorAll(`${cssId} .calc-btn`);
      this.screenElement = document.querySelector(`${cssId} output`);
    
      // Assign callback to all buttons, activated by click
      for (var button of this.buttonsList) {
        button.addEventListener('click', function() {
          _this.calcWrite(this.innerHTML, _this.screenElement);
        });
      }
    
      // Assign callback for keyboard, activated by key release
      document.addEventListener('keyup', function(e) {
        _this.calcWrite(e.key);
      });
    },
    /**
     * Write the content on the screen
     * @param {any} value The value of the button/keyboard key
     * @param {Screen} affectedScreen The screen of the actual object
     */
    calcWrite(value, affectedScreen) {
      if (value === "R") {
        // Reset all values
        affectedScreen.innerText = "0";
        calcValue = 0;
      } else if (value === "C") {
        // Cancel the last written character
        var reduceOfOne = affectedScreen.innerText.slice(0, -1);
        affectedScreen.innerText = reduceOfOne;
        if (affectedScreen.innerText === "") {
          affectedScreen.innerText = "0";
        }
      } else if (value === "=" || value === "Enter") {
        // Calcul the screen content
        /* jshint -W061 */
        affectedScreen.innerText = eval(this.calcValue);
      } else if (!isNaN(value)) {
        // If is a Number, add the number on the screen and the calcul variable
        // Check if screen display 0 to create the first value, if isn't the case, concatenate the new number to the last caracter
        if (Number(affectedScreen.innerText) === 0) {
          affectedScreen.innerText = value;
          this.calcValue = value;
        } else {
          affectedScreen.innerText += value;
          this.calcValue += value;
        }
      } else {
        // Non-special values
        if (value === "MC" || value === "M+" || value === "M-" || value === "MR") {
          this.useMemory(value, affectedScreen);
        } else if (Number(affectedScreen.innerText) === 0) {
          // If the screen display 0, only allow certain type of parameters
          switch (value) {
            case "-":
              affectedScreen.innerText += value;
              this.calcValue += "-";
              break;
            case ".":
              affectedScreen.innerText = value;
              this.calcValue = ".";
              break;
          }
        } else {
          this.setOperator(value, affectedScreen);
        }
      }
    },
    /**
     * 
     * @param {string} value Get the operator value and set the value to the screen
     * @param {Screen} affectedScreen The screen of the actual object
     */
    setOperator(value, affectedScreen) {
      let regex = /(([^\.]\d{1,}\.\d{1,}$)|(^[\.]\d{1,}))/g;
      // Check the previous writed caracter
      let lastEntry = affectedScreen.innerHTML.slice(-1);
      let canAddOperator = lastEntry === "+" ? false :
                           lastEntry === "-" ? false :
                           lastEntry === "×" || lastEntry === "*" ? false :
                           lastEntry === "÷" || lastEntry === "/" ? false :
                           lastEntry === "." || value === "." && affectedScreen.innerHTML.match(regex) ? false :
                           true;
      if (canAddOperator) {
        // When screen contain values > 0, add somes parameters
        switch (value) {
          case "+":
            affectedScreen.innerText += value;
            this.calcValue += "+";
            break;
          case "-":
            affectedScreen.innerText += value;
            this.calcValue += "-";
            break;
          case "×"||"*":
            affectedScreen.innerText += value;
            this.calcValue += "*";
            break;
          case "÷"||"/":
            affectedScreen.innerText += value;
            this.calcValue += "/";
            break;
          case ".":
            affectedScreen.innerText += value;
            this.calcValue += ".";
            break;
        }
      }
    },
    /**
     * 
     * @param {string} value The button name of the memory
     * @param {Screen} affectedScreen The screen of the actual object
     */
    useMemory(value, affectedScreen) {
      /**
       * Here we work on the memory of the calcultator
       * MC = Empty the memory
       * M+ = Add memory with new content
       * M- = Subtract the memory with the new contents
       * MR = Display memory contents on the screen
       */
      switch (value) {
        case "MC":
          this.calcMemory = 0;
          break;
        case "M+":
          this.calcMemory += affectedScreen.innerText * 1;
          affectedScreen.innerText = 0;
          break;
        case "M-":
          this.calcMemory -= affectedScreen.innerText * 1;
          affectedScreen.innerText = 0;
          break;
        case "MR":
          affectedScreen.innerText = this.calcMemory;
          break;
      }
    }
  };
}
