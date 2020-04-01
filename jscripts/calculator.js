// var body = document.querySelector("body");
// newButton = document.createElement('button');
// newButton.classList.add('btn');
// newButton.textContent = "Cliquez sur moi !";
// body.append(newButton);
// var button = document.querySelector(".btn");
// button.style.backgroundColor = "green";
// var count = 0, reset;
// button.addEventListener("click", function() {
//   count++;
//   button.textContent = `Cliqué ${count} fois !`;
//   if (count < 10) {
//     button.style.backgroundColor = "green";
//   } else if (count < 20) {
//     button.style.backgroundColor = "orange";
//   } else if (count < 30) {
//     button.style.backgroundColor = "red";
//   }
//   if (count === 20) {
//     reset = document.createElement('button');
//     reset.classList.add('calc-btn');
//     reset.textContent = "Mise à 0 !";
//     body.append(reset);
//     reset.addEventListener("click", function() {
//       count = 0;
//       button.textContent = `Cliquez sur moi !`;
//       button.style.backgroundColor = "green";
//       reset.remove();
//     });
//   }
// });

/*****************\
 *  Calculator   *
\*****************/

// Select all buttons of the calculator with class named calc-btn
var buttons = document.querySelectorAll('.calc-btn');

// Create a var for the callback containing function
var calculate = function() {
  calculator(this.innerHTML);
};

// Assign callback to all buttons
for (var button of buttons) {
  button.addEventListener('click', calculate);
}

var calculateKeyboard = function(e) {
  calculator(e.key);
};
document.addEventListener('keyup', calculateKeyboard);

// Init calcul variable and memory variable
var calcValue, calcMemory = 0;
var screen = document.querySelector('output');

/**
 * Performs various actions on the calculator
 * @param {any} value Is the text content of the button
 * 
 * @return {number}
 */
function calculator(value) {
  if (value === "R") {
    // Reset all values
    screen.innerText = "0";
    calcValue = 0;
  } else if (value === "C") {
    // Cancel the last written character
    var reduceOfOne = screen.innerText.slice(0, -1);
    screen.innerText = reduceOfOne;
    if (screen.innerText === "") {
      screen.innerText = "0";
    }
  } else if (value === "=" || value === "Enter") {
    // Calcul the screen content
    /* jshint -W061 */
    screen.innerText = eval(calcValue);
  } else if (!isNaN(value)) {
    // If is a Number, add the number on the screen and the calcul variable
    // Check if screen display 0 to create the first value, if isn't the case, concatenate the new number to the last caracter
    if (Number(screen.innerText) === 0) {
      screen.innerText = value;
      calcValue = value;
    } else {
      screen.innerText += value;
      calcValue += value;
    }
  } else {
    // Non-special values
    if (value === "MC" || value === "M+" || value === "M-" || value === "MR") {
      memoryUsage(value);
    } else if (Number(screen.innerText) === 0) {
      // If the screen display 0, only allow certain type of parameters
      switch (value) {
        case "-":
          screen.innerText += value;
          calcValue += "-";
          break;
          case ".":
            screen.innerText = value;
            calcValue = ".";
            break;
      }
    } else {
      useSpecialCaracterAndOperator(value);
    }
  }
}

/**
 * Get the memory button name and operate his fonctionnality
 * @param {string} value Memory button name
 */
function memoryUsage(value) {
  /**
   * Here we work on the memory of the calcultator
   * MC = Empty the memory
   * M+ = Add memory with new content
   * M- = Subtract the memory with the new contents
   * MR = Display memory contents on the screen
   */
  switch (value) {
    case "MC":
      calcMemory = 0;
      break;
    case "M+":
      calcMemory += screen.innerText * 1;
      screen.innerText = 0;
      break;
    case "M-":
      calcMemory -= screen.innerText * 1;
      screen.innerText = 0;
      break;
    case "MR":
      screen.innerText = calcMemory;
      break;
  }
}

/**
 * Check if user can use an operator and add the operator to the screen and calcul value
 * @param {string} value Get the calculator operator
 */
function useSpecialCaracterAndOperator(value) {
  let regex = /(([^\.]\d{1,}\.\d{1,}$)|(^[\.]\d{1,}))/g;
  console.log("Enter");
  // Check the previous writed caracter
  let canAddOperator = screen.innerHTML.slice(-1) === "+" ? false :
                      screen.innerHTML.slice(-1) === "-" ? false :
                      screen.innerHTML.slice(-1) === "×" || screen.innerHTML.slice(-1) === "*" ? false :
                      screen.innerHTML.slice(-1) === "÷" || screen.innerHTML.slice(-1) === "/" ? false :
                      screen.innerHTML.slice(-1) === "." || value === "." && screen.innerHTML.match(regex) ? false :
                      true;
  if (canAddOperator) {
    // When screen contain values > 0, add somes parameters
    switch (value) {
      case "+":
        screen.innerText += value;
        calcValue += "+";
        break;
      case "-":
        screen.innerText += value;
        calcValue += "-";
        break;
      case "×"||"*":
        screen.innerText += value;
        calcValue += "*";
        break;
      case "÷"||"/":
        screen.innerText += value;
        calcValue += "/";
        break;
      case ".":
        screen.innerText += value;
        calcValue += ".";
        break;
    }
  }
}