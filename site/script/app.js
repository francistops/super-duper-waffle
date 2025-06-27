//! my brain: we use it in almost all the function so why not make it scope to the file instead.
const wcDiv = document.getElementById("wcWrapper");

const loginBtn = document.getElementById("goToLoginButton");
const registerBtn = document.getElementById("goToRegisterButton");
const settingsBtn = document.getElementById("goToSettingsButton");
const profilBtn = document.getElementById("goToProfilButton");
const logoutBtn = document.getElementById("loggoutButton");

// --- helper fn ---
// wcTag: string
function displayNewWC(wcName) {
  wcDiv.innerHTML = "";
  return wcDiv.appendChild(document.createElement(wcName))
}

// ma solution pour le cancel mutiple. must pass an object eg: an element or WC not just a string
// le e va renvoyer ou tu veux aller donc on pour fair un if ou switch dans genre de handler pour diriger ou on veux aller. pour le moment seulement displayMain est dispo
function cancel_button(element) {
  element.addEventListener("cancel-event", (e) => {
    displayMain();
  });
}

// --- page visual ---
// landing page
function displayMain() {
  wcDiv.innerHTML = "";
  wcDiv.appendChild(document.createElement("timer-wc"));
  wcDiv.appendChild(document.createElement("task-wc"));
  wcDiv.appendChild(document.createElement("pomodoro-timer"));

  // check if user is logged in and display the right buttons
  // todo improve check
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const logoutBtn = document.getElementById("loggoutButton");
    logoutBtn.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    registerBtn.classList.add("hidden");
    settingsBtn.classList.remove("hidden");
    profilBtn.classList.remove("hidden");
  } else {
    const logoutBtn = document.getElementById("loggoutButton");
    logoutBtn.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    registerBtn.classList.remove("hidden");
    settingsBtn.classList.add("hidden");
    profilBtn.classList.add("hidden");
  }
}

//wip but should be working, i use it to test way to generalize our event listenner
function displayLoginForm(wcName = "login-form", eName = "user-logged-in") {
  const wc = displayNewWC(wcName);
  cancel_button(wc);

  wc.addEventListener(eName, (e) => {
    const user = e.detail.user;
    // wcDiv.innerHTML = ""; display main clear the page no need to clear it
    displayMain();
  });
  // wcDiv.appendChild(loginForm); appended by displayNewWC not sure if that is too early => reply to me: it is not. tested working.
}

function displayAccountRegistration() {
  cancel_button(displayNewWC('register-form'))
}

function displaySettings() {
  cancel_button(displayNewWC('setting-wc'));
}

function displayProfil() {
  displayNewWC('profil-wc');
}



//!!! super wonderful :D
function mainEventListeners() {


  loginBtn.addEventListener("click", (e) => {
    displayLoginForm();
    console.log("Login button clicked");
  });

  registerBtn.addEventListener("click", (e) => {
    displayAccountRegistration();
    console.log("Register button clicked");
  });

  settingsBtn.addEventListener("click", (e) => {
    displaySettings();
    console.log("Settings button clicked");
  });

  profilBtn.addEventListener("click", (e) => {
    displayProfil();
    console.log("Profil button clicked");
  });

  logoutBtn.addEventListener("click", (e) => {
    localStorage.removeItem("user");
    logoutBtn.classList.add("hidden");
    displayMain();
  });
}

window.addEventListener("load", (e) => {
  displayMain();
  mainEventListeners();
});

