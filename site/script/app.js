//! my brain: we use it in almost all the function so why not make it scope to the file instead.
const wcDiv = document.getElementById("wcWrapper");

// --- helper fn ---
// wcTag: string
function displayNewWC(wcName) {
  wcDiv.innerHTML = "";
  return wcDiv.appendChild(document.createElement(wcName))
}

// ma solution pour le cancel mutiple. must pass an object eg: an element or WC not just a string
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
}

//wip but should be working, i use it to test way to generalize our event listenner
function displayAuthLogin(wcName = "auth-login", eName = "user-logged-in") {
  const wc = displayNewWC(wcName);
  cancel_button(wc);

  wc.addEventListener(eName, (e) => {
    const user = e.detail.user;
    localStorage.setItem("user", JSON.stringify(user));
    // wcDiv.innerHTML = ""; display main clear the page no need to clear it
    displayMain();
  });
  // wcDiv.appendChild(authLogin); appended by displayNewWC not sure if that is too early => reply to me: it is not. tested working.
}

function displayAccountRegistration() {
  cancel_button(displayNewWC('auth-subs'))
}

function displaySettings() {
  cancel_button(displayNewWC('setting-wc'));
}

function displayProfil() {
  displayNewWC('profil-wc');
}

//!!! super wonderful
function mainEventListeners() {
  const loginBtn = document.getElementById("goToLoginButton");
  const subscribeBtn = document.getElementById("goToSubscribeButton");
  const settingsBtn = document.getElementById("goToSettingsButton");
  const profilBtn = document.getElementById("goToProfilButton");
  const logoutBtn = document.getElementById("loggoutButton");

  loginBtn.addEventListener("click", (e) => {
    displayAuthLogin();
    console.log("Login button clicked");
  });

  subscribeBtn.addEventListener("click", (e) => {
    displayAccountRegistration();
    console.log("Subscribe button clicked");
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

