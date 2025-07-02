export async function hashPassword(password) {
	let hashHex = "";
	try {
		const encoder = new TextEncoder();
		const data = encoder.encode(password);
		const hashBuffer = await crypto.subtle.digest("SHA-256", data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		hashHex = hashArray
			.map((byte) => byte.toString(16).padStart(2, "0"))
			.join("");
		console.log("hashHex", hashHex);
	} catch (error) {
		console.log(`error: ${error}`);
	}
	return hashHex;
}

async function apiCall(resource, method, auth, body = {}) {
	let result = false;
	const BASE_URL = "https://api.ft.ca/";
	const apiUrl = `${BASE_URL}${resource}`;

	const headers = {
		"Content-type": "application/json",
		Accept: "application/json",
	};
	const apiReq = {
		method: method,
		headers: headers,
	};

	if (method == "POST") apiReq["body"] = JSON.stringify(body);

	if (auth) {
		if (isIdentified()) {
			headers["Authorization"] = `Bearer ${getConnectedUser()}`;
		} else throw new Error("Empty token while required...");
	}

	try {
		const response = await fetch(apiUrl, apiReq);
		if (response.ok) {
			result = await response.json();
		} else {
			result = {
				errorCode: response.status,
				message: await response.text(),
			};
		}
	} catch (err) {
		result = {
			errorCode: 500,
			message: err.message,
		};
	}

	return result;
}

// ------ USERS ------

export function getConnectedUser() {
	return JSON.parse(localStorage.getItem("user"));
}

export function isIdentified() {
	return getConnectedUser() !== null;
}

export async function register(user) {
	let result = false;
	console.log("in auth.js register", user.role);
	const data = await apiCall("users/register", "POST", false, user);
	//! todo: display code must be must be app.js
	if (data.errorCode == 0) {
		result = true;
		// alert("registration success");
		console.log("registration success", data);
	} else {
		result = false;
		// alert("registration fail");
		console.error("unhandle error in auth.js registerJson", data);
	}

	return result;
}

export async function login(user) {
	console.log("in auth.js login");

	let result = false;

	const data = await apiCall("users/login", "POST", false, user);
	console.log("data from apiCall in auth.js login", data);
	if (data) {
		result = true;
		localStorage.setItem("user", JSON.stringify(data.token));
		document.dispatchEvent(
			new CustomEvent("auth-loggedin", {
				bubbles: true,
				composed: true,
				detail: `User logged in successfully got token: ${data.token}`,
			})
		);
	} else {
		console.error("unhandle error in auth.js login", data);
	}

	return result;
}

export async function logout() {
	console.log("in auth.js logout");
	let result = false;

	const data = await apiCall("users/logout", "POST", true);

	if (data.errorCode == 0) {
		result = data.revoked;
		localStorage.clear();
	}
	return result;
}

export async function deleteAccount(id) {
	console.log("in auth.js deleteAccount");
	let result = false;

	const data = await apiCall("users/delete", "DELETE", true, id);
	if (data.errorCode == 0) {
		result = data.id;
		localStorage.clear();

		console.log("deleteAccount success", data);
	} else {
		console.error("unhandle error in auth.js deleteAccount", data);
	}

	return result;
}

export async function getUsersByRole(role) {
	let result = false;
	const data = await apiCall(`users/role/${role}`, "GET", true);

	if (data.errorCode === 0) {
		result = data.users;
	} else {
		console.error("unhandle error in auth.js getUsersByRole", data.errorCode);
	}

	return result;
}

// ------ APPOINTMENTS ------

export async function getAppointments() {
	let result = [];

	try {
		const data = await apiCall(`appointments/`, "GET", true);

		if (data.errorCode === 0) {
			result = data.appointments;
		} else {
			console.error(
				"unhandle error in auth.js getAppointments",
				data.errorCode
			);
		}
	} catch (error) {
		console.error("Erreur réseau getAppointments:", error);
	}
	console.log(result + "auth.js getAppointments");
	return result;
}

export async function getAppointmentsById() {
	let result = [];

	try {
		const data = await apiCall(`appointments/users/:id`, "GET", true);

		if (data.errorCode === 0) {
			result = data.appointment;
		} else {
			console.error(
				"unhandle error in auth.js getAppointmentsById",
				data.errorCode
			);
		}
	} catch (error) {
		console.error("Erreur réseau getAppointmentsById:", error);
	}
	console.log(result + "auth.js getAppointmentsById");
	return result;
}

export async function createAppointments(appointment) {
	let result = [];

	try {
		const data = await apiCall(`appointments/`, "POST", true, appointment);

		if (data.errorCode === 0) {
			result = data.appointment;
		} else {
			console.error(
				"unhandle error in auth.js createAppointments",
				data.errorCode
			);
		}
	} catch (error) {
		console.error("Erreur réseau createAppointments:", error);
	}
	console.log(result + "auth.js createAppointments");
	return result;
}

export async function updateAppointmentStatus(id, status) {
	let result = false;
	try {
		const data = await apiCall(`appointments/${id}`, "PUT", true, { status });
		if (data.errorCode === 0) {
			result = data.appointment;
			console.log("Statut mis à jour :", result);
		}
	} catch (error) {
		console.error("Erreur updateAppointmentStatus:", error);
	}
	return result;
}

// ------ AVAILABILITIES ------

export async function getAvailabilities() {
	let result = [];

	try {
		const data = await apiCall(`availabilities/`, "GET", true);

		if (data.errorCode === 0) {
			result = data.availabilities;
		} else {
			console.error(
				"unhandle error in auth.js getAvailabilities",
				data.errorCode
			);
		}
	} catch (error) {
		console.error("Erreur réseau getAvailabilities:", error);
	}
	console.log(result + "auth.js getAvailabilities");
	return result;
}

export async function getAvailabilitiesByUserId(userId) {
	let result = [];

	try {
		const data = await apiCall(`availability/users/${userId}`, "GET", true);

		if (data.errorCode === 0) {
			result = data.availabilities;
		} else {
			console.error(
				"Erreur logique dans getAvailabilitiesByUserId",
				data.errorCode
			);
		}
	} catch (error) {
		console.error("Erreur réseau dans getAvailabilitiesByUserId:", error);
	}

	return result;
}

export async function createAvailability(availability) {
	let result = false;

	try {
		const data = await apiCall(`availabilities/`, "POST", true, availability);

		if (data.errorCode === 0) {
			result = data.availability || true;
			console.log("createAvailability success:", data);
		} else {
			console.error("Erreur logique dans createAvailability:", data.errorCode);
		}
	} catch (error) {
		console.error("Erreur réseau dans createAvailability:", error);
	}

	return result;
}

export async function updateAvailability(id, status) {
	let result = false;

	try {
		const data = await apiCall(`availabilities/${id}`, "PUT", true, status);

		if (data.errorCode === 0) {
			result = data.updated || true;
			console.log("updateAvailability success:", data);
		} else {
			console.error("Erreur logique dans updateAvailability:", data.errorCode);
		}
	} catch (error) {
		console.error("Erreur réseau dans updateAvailability:", error);
	}

	return result;
}

// ------ SERVICES ------

export async function getServices() {
	let result = [];

	try {
		const data = await apiCall(`services/`, "GET", false);

		if (data.errorCode === 0) {
			result = data.services;
		} else {
			console.error("unhandle error in auth.js getServices", data.errorCode);
		}
	} catch (error) {
		console.error("Erreur réseau getServices:", error);
	}
	console.log(result + "auth.js getServices");
	return result;
}

export async function createService(service) {
	let result = false;

	try {
		const data = await apiCall(`services/`, "POST", true, service);

		if (data.errorCode === 0) {
			result = data.service;
			console.log("Service créé avec succès :", result);
		} else {
			console.error("Erreur dans auth.js createService", data.errorCode);
		}
	} catch (error) {
		console.error("Erreur réseau createService:", error);
	}

	return result;
}

export async function updateService(id, service) {
	let result = false;

	try {
		const data = await apiCall(`services/${id}`, "POST", true, service);

		if (data.errorCode === 0) {
			result = data.service;
			console.log("Service mis à jour avec succès :", result);
		} else {
			console.error("Erreur dans auth.js updateService", data.errorCode);
		}
	} catch (error) {
		console.error("Erreur réseau updateService:", error);
	}

	return result;
}

export async function deleteService(id) {
	let result = false;

	try {
		const data = await apiCall(`services/${id}`, "DELETE", true);

		if (data.errorCode === 0) {
			result = data.deleted;
			console.log("Service supprimé avec succès :", result);
		} else {
			console.error("Erreur dans auth.js deleteService", data.errorCode);
		}
	} catch (error) {
		console.error("Erreur réseau deleteService:", error);
	}

	return result;
}

// ------ FEEDBACK ------

export async function getFeedbacks() {
	let result = [];

	try {
		const data = await apiCall(`feedbacks/`, "GET", false);

		if (data.errorCode === 0) {
			result = data.feedbacks;
		} else {
			console.error("unhandle error in auth.js getFeedbacks", data.errorCode);
		}
	} catch (error) {
		console.error("Erreur réseau getFeedbacks:", error);
	}
	console.log(result + "auth.js getFeedbacks");
	return result;
}

export async function createFeedback(feedback) {
	let result = false;

	try {
		const data = await apiCall(`feedbacks/`, "POST", true, feedback);

		if (data.errorCode === 0) {
			result = data.feedback || true;
			console.log("createFeedback success:", data);
		} else {
			console.error("Erreur logique dans createFeedback:", data.errorCode);
		}
	} catch (error) {
		console.error("Erreur réseau dans createFeedback:", error);
	}

	return result;
}
