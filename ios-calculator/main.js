const buttonsContainer = document.querySelector(".container-buttons");
const mainDisplay = document.getElementById("main-display");
const helperDisplay = document.getElementById("helper-display");

const calcValues = {
  firstNumber: "",
  secondNumber: "",
  operator: "",
};

let numberSwitch = true;
let operatorSwitch = false;
let singleDot = true;


const addSubMultiDiv = (number1, number2, operator) => {
  // Create decimal numbers using decimal.js libary
  const decimalNum1 = new Decimal(number1.toString());
  const decimalNum2 = new Decimal(number2.toString());
  let result = new Decimal(0);
  switch (operator) {
    case "*":
      result = decimalNum1.times(decimalNum2);
      break;
    case "-":
      result = decimalNum1.minus(decimalNum2);
      break;
    case "+":
      result = decimalNum1.plus(decimalNum2);
      break;
    case "/":
      result = decimalNum1.dividedBy(decimalNum2);
      break;
  }
  calcValues.secondNumber = "";
  return result.toString();
};


const consecutiveOperationMode = (operator) => {
  if (numberSwitch) {
    helperDisplay.value = calcValues.firstNumber + " " + operator;
    helperDisplay.style.transform = "translateY(-25px)";
    numberSwitch = false;
  } else {
    calcValues.secondNumber = mainDisplay.value;
    calcValues.firstNumber = addSubMultiDiv(
      +calcValues.firstNumber,
      +calcValues.secondNumber,
      calcValues.operator
    );
  }
  calcValues.operator = operator;
  mainDisplay.value = "";
};

const calcReset = () => {
  calcValues.firstNumber = "";
  calcValues.secondNumber = "";
  calcValues.operator = "";
  mainDisplay.value = "";
  helperDisplay.value = "";
  helperDisplay.style.transform = "translateY(0)";
  numberSwitch = true;
  singleDot = true;
  operatorSwitch = false;
};

buttonsContainer.addEventListener("click", ({ target }) => {
  if (target.classList.contains("number")) {
    if (mainDisplay.value.length < 7) {
      if (target.value === "." && mainDisplay.value.indexOf(".") >= 0) {
        return;
      }
      if (numberSwitch) {
        if (!+mainDisplay.value && target.value === ".") {
          mainDisplay.value = "0";
          calcValues.firstNumber = "0";
        }
        calcValues.firstNumber += target.value;
      } else {
        if (!+mainDisplay.value && target.value === ".") {
          mainDisplay.value = "0";
          calcValues.secondNumber = "0";
        }
        calcValues.secondNumber += target.value;
        helperDisplay.style.transform = "translateY(-50px)";
      }
      mainDisplay.value += target.value;
    }
    operatorSwitch = false;
  } else if (
    target.classList.contains("arithmetic") &&
    +calcValues.firstNumber
  ) {
    let operator = target.value === "X" ? "*" : target.value;
    operatorSwitch || consecutiveOperationMode(operator);
    operatorSwitch && (calcValues.operator = operator);
    helperDisplay.value = calcValues.firstNumber + " " + operator;
    singleDot = true;
    operatorSwitch = true;
  } else if (target.classList.contains("function") && +mainDisplay.value) {
    if (target.value === "=" && !numberSwitch) {
      calcValues.secondNumber = mainDisplay.value;
      if (operatorSwitch) {
        helperDisplay.style.transform = "translateY(-50px)";
        calcValues.secondNumber = calcValues.firstNumber;
      }
      helperDisplay.value =
        calcValues.firstNumber +
        " " +
        calcValues.operator +
        " " +
        calcValues.secondNumber +
        " =";
      calcValues.firstNumber = addSubMultiDiv(
        +calcValues.firstNumber,
        +calcValues.secondNumber,
        calcValues.operator
      );
      calcValues.secondNumber = 0;
      mainDisplay.value = calcValues.firstNumber;
      operatorSwitch = false;
      numberSwitch = true;
    } else if (target.value === "±") {
      mainDisplay.value = -mainDisplay.value;
      if (numberSwitch) {
        calcValues.firstNumber = String(-calcValues.firstNumber);
      } else {
        calcValues.secondNumber = String(-calcValues.secondNumber);
      }
    } else if (target.value === "%" && numberSwitch) {
      calcValues.firstNumber = String(calcValues.firstNumber / 100);
      mainDisplay.value = mainDisplay.value + "%";
      document.getElementById("multi").click();
    }
  } else if (target.classList.contains("reset")) {
    calcReset();
  }
});
