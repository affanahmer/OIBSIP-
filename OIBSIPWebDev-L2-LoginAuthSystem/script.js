const authCard = document.getElementById("authCard");
const dashboardCard = document.getElementById("dashboardCard");

const loginTabBtn = document.getElementById("loginTabBtn");
const registerTabBtn = document.getElementById("registerTabBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginIdentifier = document.getElementById("loginIdentifier");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");

const regIdentifier = document.getElementById("regIdentifier");
const regPassword = document.getElementById("regPassword");
const registerStatus = document.getElementById("registerStatus");

const currentUserDisplay = document.getElementById("currentUserDisplay");
const logoutBtn = document.getElementById("logoutBtn");

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem("registeredUsers")) || [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem("registeredUsers", JSON.stringify(users));
}

function getActiveSession() {
    return localStorage.getItem("activeUserSession");
}

function clearStatusMessages() {
    loginError.className = "status-msg";
    loginError.textContent = "";
    loginError.removeAttribute("style");

    registerStatus.className = "status-msg";
    registerStatus.textContent = "";
    registerStatus.removeAttribute("style");
}

function switchTab(target) {
    clearStatusMessages();

    if (target === "login") {
        loginTabBtn.classList.add("active");
        registerTabBtn.classList.remove("active");
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    } else {
        registerTabBtn.classList.add("active");
        loginTabBtn.classList.remove("active");
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
    }
}

loginTabBtn.addEventListener("click", () => switchTab("login"));
registerTabBtn.addEventListener("click", () => switchTab("register"));

function validatePassword(password) {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    return hasMinLength && hasNumber;
}

function checkAuthState() {
    const activeUser = getActiveSession();
    if (activeUser) {
        currentUserDisplay.textContent = activeUser;
        authCard.classList.add("hidden");
        dashboardCard.classList.remove("hidden");
    } else {
        authCard.classList.remove("hidden");
        dashboardCard.classList.add("hidden");
    }
}

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearStatusMessages();

    const identifier = regIdentifier.value.trim().toLowerCase();
    const password = regPassword.value;

    if (!identifier || !password) {
        registerStatus.textContent = "Please fill in all fields.";
        registerStatus.className = "status-msg error";
        return;
    }

    if (!validatePassword(password)) {
        registerStatus.textContent = "Password must be at least 8 characters long and contain at least 1 number.";
        registerStatus.className = "status-msg error";
        return;
    }

    const users = getUsers();
    const userExists = users.some(u => u.identifier === identifier);

    if (userExists) {
        registerStatus.textContent = "User already exists with this username or email.";
        registerStatus.className = "status-msg error";
        return;
    }

    users.push({ identifier, password });
    saveUsers(users);

    registerStatus.textContent = "Registration successful! You can now log in.";
    registerStatus.className = "status-msg success";

    regIdentifier.value = "";
    regPassword.value = "";

    setTimeout(() => {
        switchTab("login");
        loginIdentifier.value = identifier;
    }, 1200);
});

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearStatusMessages();

    const identifier = loginIdentifier.value.trim().toLowerCase();
    const password = loginPassword.value;

    const users = getUsers();
    const matchedUser = users.find(u => u.identifier === identifier && u.password === password);

    if (!matchedUser) {
        loginError.textContent = "Invalid username/email or password.";
        loginError.className = "status-msg error";
        return;
    }

    localStorage.setItem("activeUserSession", matchedUser.identifier);

    loginIdentifier.value = "";
    loginPassword.value = "";
    checkAuthState();
});

logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("activeUserSession");
    checkAuthState();
    switchTab("login");
});

checkAuthState();