//  Handle Slider Control and Display Password Length
let lengthDisplay = document.querySelector("[lengthDisplay");

let slider = document.querySelector("input[type=range]");

function handleSlider() {
  slider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

let passwordLength = 10;
handleSlider();

slider.addEventListener("input", (event) => {
  passwordLength = event.target.value;
  handleSlider();
});

// random Symbols
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function generateRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// random lowercase letter
function generateRandomLowercase() {
  return String.fromCharCode(generateRandom(97, 123));
}

// random uppercaser letter
function generateRandomUppercase() {
  return String.fromCharCode(generateRandom(65, 91));
}

// Random Number
function generateRandomNumber() {
  return generateRandom(1, 10);
}

// Generate Symbol
function generateRandomSymbol() {
  let index = generateRandom(0, symbol.length);
  return symbol[index];
}

// strength color based on password
let indicator = document.querySelector(".indicator");

// Set Indicator
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

// Default Indicator
setIndicator("#ccc");

const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercase.checked) hasUpper = true;
  if (lowercase.checked) hasLower = true;
  if (numbers.checked) hasNumber = true;
  if (symbols.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// Copy Message
let copyMessage = document.querySelector("[copyMessage]");
let copyBtn = document.querySelector(".copyBtn");
let passwordDisplay = document.querySelector("input[passwordDisplay]");

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);

    copyMessage.innerText = "Copied";
  } catch (e) {
    // if it will fail then it will show up
    copyMessage.innerText = "Failed";
  }

  copyMessage.classList.add("active");

  setTimeout(() => {
    copyMessage.classList.remove("active");
  }, 2000);
}

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

// shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
// Shuffle the array randomly -in Fisher Yates Method
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

let checkBoxes = document.querySelectorAll("input[type=checkbox]");

let checkCount = 0;

function handleCheckBoxChange() {
  checkCount = 0;
  checkBoxes.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

checkBoxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

let password = "";
let generateBtn = document.querySelector("#generateBtn");

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // remove the old password so when we update we will get the the new password every time
  password = "";

  // this will put the function according to the checkbox ticked
  let arrayOfCheckedFunction = [];

  if (uppercase.checked) arrayOfCheckedFunction.push(generateRandomUppercase);
  if (lowercase.checked) arrayOfCheckedFunction.push(generateRandomLowercase);
  if (numbers.checked) arrayOfCheckedFunction.push(generateRandomNumber);
  if (symbols.checked) arrayOfCheckedFunction.push(generateRandomSymbol);

  // Compulsory Addition
  for (let i = 0; i < arrayOfCheckedFunction.length; i++) {
    password += arrayOfCheckedFunction[i]();
  }

  // Additional addition
  for (let i = 0; i < passwordLength - arrayOfCheckedFunction.length; i++) {
    let randIndex = generateRandom(0, arrayOfCheckedFunction.length);
    password += arrayOfCheckedFunction[randIndex]();
  }

  // Shuffle Password
  password = shuffle(Array.from(password));
  passwordDisplay.value = password;
  calcStrength();
});
