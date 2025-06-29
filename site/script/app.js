const wcDiv = document.getElementById("wcWrapper");

const h1 = document.querySelector("h1");
const loginBtn = document.getElementById("goToLoginButton");
const registerBtn = document.getElementById("goToRegisterButton");
const profilBtn = document.getElementById("goToProfilButton");
const logoutBtn = document.getElementById("loggoutButton");

function displayComponent(wcName, events = {}) {
	wcDiv.innerHTML = "";

	const wc = wcDiv.appendChild(document.createElement(wcName));

	cancel_button(wc);

	for (const [eventName, handler] of Object.entries(events)) {
		wc.addEventListener(eventName, handler);
	}

	return wc;
}

function mainEventListeners() {
	h1.addEventListener("click", (e) => {
		displayMain();
	});

	loginBtn.addEventListener("click", (e) => {
		displayLoginForm();
		console.log("Login button clicked");
	});

	registerBtn.addEventListener("click", (e) => {
		displayRegisterForm();
		console.log("Register button clicked");
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

function cancel_button(element) {
	element.addEventListener("cancel-event", (e) => {
		displayMain();
	});
}

function displayMain(wcName = "main-wc") {
	displayComponent(wcName);

	const user = JSON.parse(localStorage.getItem("user"));
	const isLoggedIn = user !== null;

	logoutBtn.classList.toggle("hidden", !isLoggedIn);
	loginBtn.classList.toggle("hidden", isLoggedIn);
	registerBtn.classList.toggle("hidden", isLoggedIn);
	profilBtn.classList.toggle("hidden", !isLoggedIn);
}

function displayLoginForm() {
	displayComponent("login-form", {
		"user-logged-in": (e) => {
			console.log("User logged successfully");
			displayMain();
		},
	});
}

function displayRegisterForm() {
	displayComponent("register-form", {
		registered: () => {
			console.log("User registered successfully");
			displayLoginForm();
		},
	});
}

function displaySettings() {
	displayComponent("setting-wc");
}

function displayProfil() {
	displayComponent("profil-wc", {
		"go-to-settings": () => {
			console.log("Go to settings from profil");
			displaySettings();
		},
		"delete-account": () => {
			console.log("Account deleted");
			deleteAccount(); // À faire
			displayMain();
		},
	});
}

window.addEventListener("load", (e) => {
	displayMain();
	mainEventListeners();
});
