// import { deleteAccount, createAppointment, getApointmentsById, getAvailabilityById } from "../../script/auth.js";

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

async function displayMain() {
	console.log("in display main");
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
					console.log("User logged successfully", e.detail);

					const { id, role, token } = e.detail;

					localStorage.setItem(
						"user",
						JSON.stringify({
							id: id,
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
					console.log("User registered successfully");
					displayLoginForm();
				},
			},
		},
		true
	);
}

function displaySettings() {
	displayMultipleComponents(
		["setting-wc"],
		{
			"setting-wc": {
				"updated-user": (e) => {
					console.log("User updated successfully");
					displayMain();
				},
				"updated-password": (e) => {
					console.log("Password updated successfully");
					displayMain();
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
			"go-to-settings": () => displaySettings(),
			"delete-account": () => {
				deleteAccount();
				displayMain();
			},
		},
	};

	if (isClient) {
	components.push("appointments-client", "handling-availabilities-client");
	eventsPerComponent["handling-availabilities-client"] = {
		"appointment-selected": async (e) => {
			const { date, hairdresserId, serviceId } = e.detail;
			console.log(
				"Client a choisi le rendez-vous :",
				date,
				hairdresserId,
				serviceId
			);
			// appel API ici
		},
	};
	} else if (isHairdresser) {
		components.push(
			"appointments-hairdresser",
			"handling-availabilities-hairdresser"
		);
		eventsPerComponent["handling-availabilities-hairdresser"] = {
			"date-selected": (e) => {
				const date = e.detail.date;
				const oldSlots = wcDiv.querySelector("availability-slots");
				if (oldSlots) oldSlots.remove();

				const slotsWC = document.createElement("availability-slots");
				slotsWC.setAttribute("start-date", date);
				wcDiv.appendChild(slotsWC);
			},
		};
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

export function getNextMonday(date) {
	const next = new Date(date);
	const day = next.getDay();
	const diff = (8 - day) % 7 || 7;
	next.setDate(next.getDate() + diff);
	return next.toISOString().split("T")[0];
}

window.addEventListener("load", (e) => {
	displayMain();
	mainEventListeners();
});
