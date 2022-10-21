const uppercase = [];
const lowercase = [];
const numbers = [];
const symbols = [];
const arrayGrid = [];

const inputs = document.querySelectorAll("input[type= checkbox]");
const generate = document.getElementById("generate");
const rangeInput = document.getElementById("range");
const answerField = document.getElementById("password");
const strength = document.getElementById("strengthMeasurement");
const rangeNumber = document.getElementById("rangeNumber");
const colorBar = document.querySelectorAll("#strengthContainer div");
const copiedField = document.getElementById("copyField");

const symbolsRegex = new RegExp(/[!\#$%&'()*+,-./:;<=>?@^_`{}|~]/);
const lowercaseRegex = new RegExp(/[a-z]/);
const uppercaseRegex = new RegExp(/[A-Z]/);
const numbersRegex = new RegExp(/[0-9]/);
populateArrays();

let reset = "P4$5W0rD!";
let password = "";
let stringStrength = "";
let length = rangeInput.value;
let count = 0;

answerField.innerText = reset;
rangeNumber.innerText = rangeInput.value;

function populateArrays() {
   for (let i = 33; i <= 126; i++) {
      if (i >= 97 && i <= 122) {
         lowercase.push(String.fromCharCode(i));
      } else if (i >= 65 && i <= 90) {
         uppercase.push(String.fromCharCode(i));
      } else if (i >= 48 && i <= 57) {
         numbers.push(String.fromCharCode(i));
      } else {
         symbols.push(String.fromCharCode(i));
      }
   }
}

function addtoArray(array) {
   for (let i = 0; i < array.length; i++) {
      arrayGrid.push(array[i]);
   }
}

function resetColorBars() {
   for (let i = 0; i < 4; i++) {
      colorBar[i].classList.remove("tooWeak");
      colorBar[i].classList.remove("weak");
      colorBar[i].classList.remove("medium");
      colorBar[i].classList.remove("strong");
   }
}

function addColorClass(n, string) {
   resetColorBars();
   for (let i = 0; i < n; i++) {
      colorBar[i].classList.add(string);
   }
}

function colorBars() {
   switch (stringStrength) {
      case "TOO WEAK!":
         addColorClass(1, "tooWeak");
         break;
      case "WEAK":
         addColorClass(2, "weak");
         break;
      case "MEDIUM":
         addColorClass(3, "medium");
         break;
      case "STRONG":
         addColorClass(4, "strong");
         break;
      default:
         break;
   }
}

function trimArray(array) {
   for (let i = 0; i < arrayGrid.length; i++) {
      for (let j = 0; j < array.length; j++) {
         if (arrayGrid[i] == array[j]) {
            arrayGrid.splice(i, 1);
         }
      }
   }
}

function generatePassword(range) {
   let string = "";
   for (let i = 0; i < range; i++) {
      if (arrayGrid.length != 0) {
         const rand = Math.floor(Math.random() * arrayGrid.length);
         string += arrayGrid[rand];
      } else {
         string = "";
      }
   }
   return string;
}

function getCheckedNumber() {
   let number = 0;
   inputs.forEach((input) => {
      if (input.checked) {
         number++;
      }
   });
   return number;
}

function checkOptions(regex) {
   return password.match(regex) ? true : false;
}

function checkPassword() {
   let validPassword = true;
   for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
         switch (inputs[i].id) {
            case "uppercase":
               if (!checkOptions(uppercaseRegex)) {
                  validPassword = false;
               }
               break;
            case "lowercase":
               if (!checkOptions(lowercaseRegex)) {
                  validPassword = false;
               }
               break;
            case "numbers":
               if (!checkOptions(numbersRegex)) {
                  validPassword = false;
               }
               break;
            case "symbols":
               if (!checkOptions(symbolsRegex)) {
                  validPassword = false;
               }
               break;
            default:
               break;
         }
      }
   }
   if (!validPassword && length >= count) {
      password = generatePassword(length);
      checkPassword();
   }
   answerField.innerText = arrayGrid.length > 0 ? password : reset;
   calcStrength();
}
function returnError() {
   if (password.length == 0) {
      password = "3RR0R";
   }
   return password;
}
function calcStrength() {
   if (password.length === 0) {
      stringStrength = "";
   } else if (password.length <= 3) {
      stringStrength = "TOO WEAK!";
   } else if (password.length <= 6 && password.length > 3) {
      if (inputs[3].checked) {
         stringStrength = "MEDIUM";
      } else if (!inputs[3].checked && count >= 2) {
         stringStrength = "WEAK";
      } else {
         stringStrength = "TOO WEAK!";
      }
   } else if (password.length <= 12 && password.length > 6) {
      if (inputs[3].checked || count > 2) {
         stringStrength = "STRONG";
      } else if (!inputs[3].checked && count < 2) {
         stringStrength = "WEAK";
      } else {
         stringStrength = "MEDIUM";
      }
   } else {
      if (count === 1) {
         stringStrength = "WEAK";
      } else if (count > 2 || inputs[3].checked) {
         stringStrength = "STRONG";
      } else {
         stringStrength = "MEDIUM";
      }
   }
   strength.innerText = stringStrength;
   colorBars();
}

//For every checked inputs, add the corresponding array to the arrayGrid
//If unchecked trim arrayGrid
inputs.forEach((input) => {
   input.addEventListener("click", () => {
      switch (input.id) {
         case "uppercase":
            input.checked ? addtoArray(uppercase) : trimArray(uppercase);
            break;
         case "lowercase":
            input.checked ? addtoArray(lowercase) : trimArray(lowercase);
            break;
         case "numbers":
            input.checked ? addtoArray(numbers) : trimArray(numbers);
            break;
         case "symbols":
            input.checked ? addtoArray(symbols) : trimArray(symbols);
            break;
         default:
            break;
      }
   });
});

function displayCopied() {
   if (window.innerWidth >= 768) {
      copiedField.innerText = "copied";
      setTimeout(() => {
         copiedField.innerText = "";
      }, 2000);
   }
}

function copyToClipboard() {
   navigator.clipboard.writeText(password);
}

//Define password.length
rangeInput.addEventListener("input", () => {
   length = rangeInput.value;
   rangeNumber.innerText = rangeInput.value;
   updateRange();
});

//Proc functions
generate.addEventListener("click", () => {
   resetColorBars();
   password = generatePassword(length);
   answerField.innerText = arrayGrid.length > 0 ? password : reset;
   count = getCheckedNumber();
   checkPassword();
   answerField.style.color = password.length > 0 ? "#e6e5ea" : "#817d92";
});

copiedField.nextElementSibling.addEventListener("click", () => {
   if (password.length > 0) {
      copyToClipboard();
      displayCopied();
   }
});

function updateRange() {
   const slideWidth = rangeInput.getBoundingClientRect().width;
   const slideFill = (slideWidth / 100) * (length * 5);
   document.documentElement.style.setProperty(
      "--slideShadow",
      slideFill + "px"
   );
}
updateRange();

window.addEventListener("resize", () => {
   updateRange();
});
