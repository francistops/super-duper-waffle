import {
	deactivateAccount,
	createAppointment,
	getUserIdAppointments,
	getUserIdAvailabilities,
	logout,
} from "../../script/auth.js";

const wcDiv = document.getElementById("wcWrapper");

const h1 = document.querySelector("h1");
const loginBtn = document.getElementById("goToLoginButton");
const registerBtn = document.getElementById("goToRegisterButton");
const profilBtn = document.getElementById("goToProfilButton");
const logoutBtn = document.getElementById("loggoutButton");

function displayMultipleComponents(
	wcNames = [],
	eventsPerComponent = {},
	clear = false
) {
	if (clear) {
		wcDiv.innerHTML = "";
	}

	const components = [];

	for (const name of wcNames) {
		const wc = wcDiv.appendChild(document.createElement(name));
		cancel_button(wc);
		components.push(wc);

		if (eventsPerComponent[name]) {
			for (const [eventName, handler] of Object.entries(
				eventsPerComponent[name]
			)) {
				wc.addEventListener(eventName, handler);
			}
		}
	}

	return components;
}

function mainEventListeners() {
	h1.addEventListener("click", (e) => {
		displayMain();
	});

	loginBtn.addEventListener("click", (e) => {
		displayLoginForm();
	});

	registerBtn.addEventListener("click", (e) => {
		displayRegisterForm();
	});

	profilBtn.addEventListener("click", (e) => {
		displayProfil();
	});

	logoutBtn.addEventListener("click", (e) => {
		const userId = JSON.parse(localStorage.getItem("user"))?.id;
		logout(userId);
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

async function displayMain() {
	displayMultipleComponents(["services-wc", "feedbacks-wc"], {}, true);

	const user = JSON.parse(localStorage.getItem("user"));
	const isLoggedIn = !!user?.token;

	logoutBtn.classList.toggle("hidden", !isLoggedIn);
	loginBtn.classList.toggle("hidden", isLoggedIn);
	registerBtn.classList.toggle("hidden", isLoggedIn);
	profilBtn.classList.toggle("hidden", !isLoggedIn);
}

function displayLoginForm() {
	displayMultipleComponents(
		["login-form"],
		{
			"login-form": {
				"user-logged-in": (e) => {
					const { id, email, role, token } = e.detail;

					localStorage.setItem(
						"user",
						JSON.stringify({
							id: id,
							email: email,
							role: role,
							token: token,
						})
					);

					wcDiv.innerHTML = "";
					displayMain();
				},
			},
		},
		true
	);
}

function displayRegisterForm() {
	displayMultipleComponents(
		["register-form"],
		{
			"register-form": {
				registered: (e) => {
					displayLoginForm();
				},
			},
		},
		true
	);
}

function displayProfil() {
	const user = JSON.parse(localStorage.getItem("user"));
	const isClient = user?.role === "client";
	const isHairdresser = user?.role === "hairdresser";

	const components = ["profil-wc"];
	const eventsPerComponent = {
		"profil-wc": {
			"deactivate-account": () => {
				displayDeactivate();
				deactivateAccount(); // Pas fini !!!!
				displayMain();
			},
		},
	};

	if (isClient) {
		components.push("appointments-client", "handling-availabilities-client");
	} else if (isHairdresser) {
		components.push(
			"appointments-hairdresser",
			"handling-availabilities-hairdresser"
		);
	}
	displayMultipleComponents(components, eventsPerComponent, true);
}

export function formatDate(isoString) {
	const date = new Date(isoString);
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	const hh = String(date.getHours()).padStart(2, "0");
	const min = String(date.getMinutes()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export function getDateFromToday(offset = 0) {
	const today = new Date();
	today.setDate(today.getDate() + offset);
	return today.toISOString().split("T")[0];
}

window.addEventListener("load", (e) => {
	displayMain();
	mainEventListeners();
});
