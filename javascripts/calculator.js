/**
 * @author tristantheb
 * @version 1.1.0
 */

/**
 * This factory generate a new calculator
 * @param {string} cssId The ID CSS of the calculator
 */
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
     * Initializes the calculator and adds all callbacks
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
      // document.addEventListener('keyup', function(e) {
      //   _this.calcWrite(e.key);
      // });
    },
    /**
     * Write the content on the screen
     * @param {any} value The value of the button/keyboard key
     * @param {Screen} affectedScreen The screen of the actual object
     */
    calcWrite(value, affectedScreen) {
      if (value === "R") {
        // Reset all values
        affectedScreen.textContent = "0";
        this.calcValue = 0;
      } else if (value === "C") {
        // Cancel the last written character
        var reduceOfOne = affectedScreen.textContent.slice(0, -1);
        affectedScreen.textContent = reduceOfOne;
        if (affectedScreen.textContent === "") {
          affectedScreen.textContent = "0";
        }
      } else if (value === "=" || value === "Enter") {
        // Calcul the screen content
        /* jshint -W061 */
        affectedScreen.textContent = eval(this.calcValue);
      } else if (!isNaN(value)) {
        // If is a Number, add the number on the screen and the calcul variable
        // Check if screen display 0 to create the first value, if isn't the case, concatenate the new number to the last caracter
        if (Number(affectedScreen.textContent) === 0) {
          affectedScreen.textContent = value;
          this.calcValue = value;
        } else {
          affectedScreen.textContent += value;
          this.calcValue += value;
        }
      } else {
        // Non-special values
        if (value === "MC" || value === "M+" || value === "M-" || value === "MR") {
          this.useMemory(value, affectedScreen);
        } else if (Number(affectedScreen.textContent) === 0) {
          // If the screen display 0, only allow certain type of parameters
          switch (value) {
            case "-":
              affectedScreen.textContent += value;
              this.calcValue += "-";
              break;
            case ".":
              affectedScreen.textContent = value;
              this.calcValue = ".";
              break;
          }
        } else {
          this.setOperator(value, affectedScreen);
        }
      }
    },
    /**
     * Set the choosen operator when is possible
     * @param {string} newValue Get the operator value and set the value to the screen
     * @param {Screen} affectedScreen The screen of the actual object
     */
    setOperator(newValue, affectedScreen) {
      if (this.canAddOperator(newValue, affectedScreen)) {
        // When screen contain values > 0, add somes parameters
        switch (newValue) {
          case "+":
            affectedScreen.textContent += newValue;
            this.calcValue += "+";
            break;
          case "-":
            affectedScreen.textContent += newValue;
            this.calcValue += "-";
            break;
          case "×"||"*":
            affectedScreen.textContent += newValue;
            this.calcValue += "*";
            break;
          case "÷"||"/":
            affectedScreen.textContent += newValue;
            this.calcValue += "/";
            break;
          case ".":
            affectedScreen.textContent += newValue;
            this.calcValue += ".";
            break;
        }
      }
    },
    /**
     * Check if the last writed character is an operator
     * @param {string} newValue Get the operator value and set the value to the screen
     * @param {Screen} affectedScreen The screen of the actual object
     */
    canAddOperator(newValue, affectedScreen) {
      // Check the previous writed caracter
      let lastEntry = affectedScreen.textContent.slice(-1);
      switch (lastEntry) {
        case "+":
          return false;
        case "-":
          return false;
        case "×"||"*":
          return false;
        case "÷"||"/":
          return false;
        case ".":
          return false;
        default:
          if(this.isDualDotInNumber(newValue, affectedScreen)) return false;
          return true;
      }
    },
    /**
     * Check if the last number contain a dot or not
     * @param {string} newValue Get the operator value and set the value to the screen
     * @param {Screen} affectedScreen The screen of the actual object
     */
    isDualDotInNumber(newValue, affectedScreen) {
      const regexDot = /(([^\.]\d{1,}\.\d{1,}$)|(^[\.]\d{1,}))/g;
      return newValue === "." && affectedScreen.textContent.match(regexDot);
    },
    /**
     * Performs actions concerning the calculation memory
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
          if(this.isValidMemoryUsage(affectedScreen.textContent)) {
            this.calcMemory += affectedScreen.textContent * 1;
            affectedScreen.textContent = 0;
          } else {
            console.warn("You cannot memorize a calculation that has not been completed.");
          }
          break;
        case "M-":
          if(this.isValidMemoryUsage(affectedScreen.textContent)) {
            this.calcMemory -= affectedScreen.textContent * 1;
            affectedScreen.textContent = 0;
          } else {
            console.warn("You cannot memorize a calculation that has not been completed.");
          }
          break;
        case "MR":
          affectedScreen.textContent = this.calcMemory;
          break;
      }
    },
    /**
     * Check if the content is a valid number and not an unfinished calcul
     * @param {string} toValidate The text content of the object Screen
     */
    isValidMemoryUsage(toValidate) {
      return !isNaN(toValidate);
    }
  };
}
