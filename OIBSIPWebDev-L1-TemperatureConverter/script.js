const tempInput = document.getElementById("tempInput");
const unitSelect = document.getElementById("unitSelect");
const convertBtn = document.getElementById("convertBtn");
const errorMsg = document.getElementById("errorMsg");
const resultsArea = document.getElementById("resultsArea");
const resCelsius = document.getElementById("resCelsius");
const resFahrenheit = document.getElementById("resFahrenheit");
const resKelvin = document.getElementById("resKelvin");

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = "block";
    resultsArea.style.display = "none";
}

function clearError() {
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
}

function performConversion() {
    clearError();
    const rawValue = tempInput.value.trim();

    if (rawValue === "") {
        showError("Please enter a numeric temperature value.");
        return;
    }

    const numValue = Number(rawValue);

    if (isNaN(numValue)) {
        showError("Invalid input: Please enter a valid number (e.g., 36.5, -12).");
        return;
    }

    const unit = unitSelect.value;
    let celsius;

    if (unit === "C") {
        celsius = numValue;
    } else if (unit === "F") {
        celsius = (numValue - 32) * (5 / 9);
    } else if (unit === "K") {
        celsius = numValue - 273.15;
    }

    if (celsius < -273.15) {
        showError("Temperature violates physics: Cannot fall below absolute zero (-273.15°C / -459.67°F / 0K).");
        return;
    }

    const fahrenheit = (celsius * (9 / 5)) + 32;
    const kelvin = celsius + 273.15;

    resCelsius.textContent = celsius.toFixed(2) + " °C";
    resFahrenheit.textContent = fahrenheit.toFixed(2) + " °F";
    resKelvin.textContent = kelvin.toFixed(2) + " K";

    resultsArea.style.display = "grid";
}

convertBtn.addEventListener("click", performConversion);

tempInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        performConversion();
    }
});