function displayMain() {
  const wcDiv = document.getElementById("wcWrapper");
  wcDiv.innerHTML = "";
  const timerWC = document.createElement("timer-wc");
  wcDiv.appendChild(timerWC);
}

function displayAuthLogin() {
  const wcDiv = document.getElementById("wcWrapper");
  wcDiv.innerHTML = "";
  const authLogin = document.createElement("auth-login");

  authLogin.addEventListener("user-logged-in", (e) => {
    const user = e.detail.user;
    localStorage.setItem("user", JSON.stringify(user));
    wcDiv.innerHTML = "";
    displayMain();
  });

  authLogin.addEventListener("go-back-to-main-from-form", (e) => {
    wcDiv.innerHTML = "";
    displayMain();
  });
  wcDiv.appendChild(authLogin);
}

function displayAuthSubs() {
  const wcDiv = document.getElementById("wcWrapper");
  wcDiv.innerHTML = "";
  const authSubs = document.createElement("auth-subs");

  authSubs.addEventListener("go-back-to-main-from-form", (e) => {
    wcDiv.innerHTML = "";
    displayMain();
  });

  wcDiv.appendChild(authSubs);
}

function displaySettings() {
  const wcDiv = document.getElementById("wcWrapper");
  wcDiv.innerHTML = "";
  const settingWC = document.createElement("setting-wc");

  settingWC.addEventListener("go-back-to-main-from-form", (e) => {
    wcDiv.innerHTML = "";
    displayMain();
  });

  wcDiv.appendChild(settingWC);
}

function displayProfil() {
  document.getElementById("wcWrapper").innerHTML = "";
  wcDiv.appendChild(document.createElement("profil-wc"));
}

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
    displayAuthSubs();
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

