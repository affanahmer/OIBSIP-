let currentInput = "0";
let previousInput = "";
let chosenOperator = null;
let shouldResetScreen = false;

const currentOperandDisplay = document.getElementById("currentOperand");
const previousOperandDisplay = document.getElementById("previousOperand");
const clearBtn = document.getElementById("btnClear");
const deleteBtn = document.getElementById("btnDelete");
const equalsBtn = document.getElementById("btnEquals");
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

function updateDisplay() {
    currentOperandDisplay.textContent = currentInput;
    if (chosenOperator != null && previousInput !== "") {
        previousOperandDisplay.textContent = `${previousInput} ${chosenOperator}`;
    } else {
        previousOperandDisplay.textContent = "";
    }
}

function appendNumber(number) {
    if (currentInput === "Error") {
        clearAll();
    }

    if (shouldResetScreen) {
        currentInput = "";
        shouldResetScreen = false;
    }

    if (number === "." && currentInput.includes(".")) {
        return;
    }

    if (currentInput === "0" && number !== ".") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function deleteNumber() {
    if (currentInput === "Error" || shouldResetScreen) {
        clearAll();
        return;
    }

    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith("-"))) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

function clearAll() {
    currentInput = "0";
    previousInput = "";
    chosenOperator = null;
    shouldResetScreen = false;
    updateDisplay();
}

function executeCalculation() {
    if (chosenOperator === null || shouldResetScreen || currentInput === "Error") {
        return;
    }

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) {
        return;
    }

    let result = 0;

    switch (chosenOperator) {
        case "+":
            result = prev + current;
            break;
        case "-":
            result = prev - current;
            break;
        case "×":
            result = prev * current;
            break;
        case "÷":
            if (current === 0) {
                currentInput = "Error";
                previousInput = "";
                chosenOperator = null;
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    result = Math.round(result * 100000000) / 100000000;
    currentInput = result.toString();
    chosenOperator = null;
    previousInput = "";
    shouldResetScreen = true;
    updateDisplay();
}

function selectOperator(operator) {
    if (currentInput === "Error") {
        return;
    }

    if (chosenOperator !== null && !shouldResetScreen) {
        executeCalculation();
        if (currentInput === "Error") {
            return;
        }
    }

    chosenOperator = operator;
    previousInput = currentInput;
    shouldResetScreen = true;
    updateDisplay();
}

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectOperator(button.dataset.operator);
    });
});

clearBtn.addEventListener("click", clearAll);
deleteBtn.addEventListener("click", deleteNumber);
equalsBtn.addEventListener("click", executeCalculation);