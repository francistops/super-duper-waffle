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
			const errorText = await response.text();
			let errorJson = {};
			try {
				errorJson = JSON.parse(errorText);
			} catch (e) {
				errorJson = { message: errorText };
			}
			result = {
				errorCode: response.status,
				message: errorJson.message ?? "Erreur inconnue",
				data: errorJson,
			};
		}
	} catch (err) {
		result = {
			errorCode: 500,
			message: err.message ?? "Erreur inattendue",
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
	const data = await apiCall("users/register", "POST", false, user);

	if (data.errorCode !== 0) {
		console.error(
			"unhandled error in auth.js register",
			"data.errorCode: ",
			data.errorCode,
			"data:",
			data
		);
		return false;
	}

	console.log("registration success", data);
	return true;
}

export async function login(user) {
	const data = await apiCall("users/login", "POST", false, user);

	if (data.errorCode !== 0) {
		console.error(
			"unhandled error in auth.js login",
			"data.errorCode:",
			data.errorCode,
			"data:",
			data
		);
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur de connexion",
		};
	}

	// Vérification minimale de sécurité
	if (!data.user || !data.token) {
		console.error(
			"Réponse invalide du backend : utilisateur ou token manquant."
		);
		return {
			success: false,
			errorCode: 500,
			message: "Réponse serveur incomplète",
		};
	}

	console.log("Login success:", data);
	return {
		success: true,
		user: data.user,
		token: data.token,
		role: data.role ?? null,
	};
}

export async function logout() {
	console.log("in auth.js logout");

	const data = await apiCall("users/logout", "POST", true);

	if (data.errorCode !== 0) {
		console.error(
			"unhandled error in auth.js logout",
			"data.errorCode:",
			data.errorCode,
			"data:",
			data
		);
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur de déconnexion",
		};
	}

	if (data.revoked) {
		localStorage.clear();
	}

	console.log("Déconnexion réussie.");
	return {
		success: true,
		revoked: data.revoked,
	};
}

export async function deactivateAccount(id) {
	console.log("in auth.js deleteAccount");
	let result = false;

	const data = await apiCall("users/deactivate", "POST", true, { id });
	if (data.errorCode == 0) {
		result = true;
		localStorage.clear();

		console.log("deactivateAccount success", " data : ", data);
	} else {
		console.error(
			"unhandle error in auth.js deactivateAccount",
			" data : ",
			data
		);
	}
	return result;
}

// export async function getUsers() {
// 	let result = [];
// 	const data = await apiCall(`users/`, "GET", true);

// 	if (data.errorCode === 0) {
// 		result = data.users;
// 	} else {
// 		console.error(
// 			"unhandle error in auth.js getUsers",
// 			"data.errorCode: ",
// 			data.errorCode,
// 			" data : ",
// 			data
// 		);
// 	}
// 	return result;
// }

// export async function getUserById(id) {
// 	let result = {};
// 	const data = await apiCall(`users/${id}`, "GET", true);

// 	if (data.errorCode === 0) {
// 		result = data.user;
// 	} else {
// 		console.error(
// 			"unhandle error in auth.js getUserById",
// 			"data.errorCode: ",
// 			data.errorCode,
// 			" data : ",
// 			data
// 		);
// 	}
// 	return result;
// }

export async function getUsersByRole(role) {
	let result = [];
	const data = await apiCall(`users/role/${role}`, "GET", true);

	if (data.errorCode === 0) {
		result = data.users;
	} else {
		console.error(
			"unhandle error in auth.js getUsersByRole",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	return result;
}

export async function getUserIdAppointments(id) {
	let result = [];
	// Pas fonctionel, à vérifier
	const data = await apiCall(`users/${id}/appointments`, "GET", true);

	if (data.errorCode === 0) {
		result = data.appointments;
	} else {
		console.error(
			"unhandle error in auth.js getUserIdAppointments",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	console.log("auth.js getUserIdAppointments", result);
	return result;
}

export async function getUserIdAvailabilities(userId) {
	let result = [];
	// Pas fonctionel, à vérifier
	const data = await apiCall(`users/${userId}/availabilities`, "GET", true);

	if (data.errorCode === 0) {
		result = data.availabilities;
	} else {
		console.error(
			"unhandle error in auth.js getUserIdAvailabilities",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	console.log("auth.js getUserIdAvailabilities", result);
	return result;
}

// ------ APPOINTMENTS ------

export async function createAppointment(appointment) {
	const data = await apiCall(`appointments/`, "POST", true, appointment);

	if (data.errorCode !== 0) {
		console.error("unhandle error in createAppointments", data);
		return { success: false, errorCode: data.errorCode, message: data.message };
	}

	console.log("auth.js createAppointment", data);
	return {
		success: true,
		appointment: data.appointment,
	};
}

export async function updateAppointmentStatus(id, status) {
	const data = await apiCall(`appointments/${id}`, "POST", true, { status });

	if (data.errorCode !== 0) {
		console.error(
			"unhandled error in auth.js updateAppointmentStatus",
			"data.errorCode:",
			data.errorCode,
			"data:",
			data
		);
		return { success: false, errorCode: data.errorCode, message: data.message };
	}

	console.log("Statut mis à jour :", data.appointment);
	return {
		success: true,
		appointment: data.appointment,
	};
}

// ------ AVAILABILITIES ------

export async function getAvailabilities() {
	let result = [];

	const data = await apiCall(`availabilities/`, "GET", true);

	if (data.errorCode === 0) {
		result = data.availabilities;
	} else {
		console.error(
			"unhandle error in auth.js getAvailabilities",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	console.log(result + "auth.js getAvailabilities");
	return result;
}

export async function getAvailabilitiesByUserId(userId) {
	let result = [];

	const data = await apiCall(`availability/users/${userId}`, "GET", true);

	if (data.errorCode === 0) {
		result = data.availabilities;
	} else {
		console.error(
			"unhandle error in auth.js getAvailabilitiesByUserId",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	return result;
}

export async function createAvailability(availability) {
	let result = false;

	const data = await apiCall(`availabilities/`, "POST", true, availability);

	if (data.errorCode === 0) {
		result = data.availability || true;
		console.log("createAvailability success:", data);
	} else {
		console.error(
			"unhandle error in auth.js createAvailability",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	return result;
}

export async function updateAvailability(id, status) {
	let result = false;

	const data = await apiCall(`availabilities/${id}`, "POST", true, { status });

	if (data.errorCode === 0) {
		result = data.updated || true;
		console.log("updateAvailability success:", data);
	} else {
		console.error(
			"unhandle error in auth.js updateAvailability",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	return result;
}

// ------ SERVICES ------

export async function getServices() {
	let result = [];

	const data = await apiCall(`services/`, "GET", false);

	if (data.errorCode === 0) {
		result = data.services;
	} else {
		console.error(
			"unhandle error in auth.js getServices",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	return result;
}

export async function createService(service) {
	let result = false;

	const data = await apiCall(`services/`, "POST", true, service);

	if (data.errorCode === 0) {
		result = data.service;
		console.log("Service créé avec succès :", result);
	} else {
		console.error(
			"unhandle error in auth.js createService",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	return result;
}

export async function updateService(id, service) {
	let result = false;
	const data = await apiCall(`services/${id}`, "POST", true, service);

	if (data.errorCode === 0) {
		result = data.service;
		console.log("Service mis à jour avec succès :", result);
	} else {
		console.error(
			"unhandle error in auth.js updateService",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	return result;
}

export async function deactivateService(id) {
	let result = false;
	const data = await apiCall(`services/${id}`, "POST", true, id);

	if (data.errorCode === 0) {
		result = data.deactivated;
		console.log("Service supprimé avec succès :", result);
	} else {
		console.error(
			"unhandle error in auth.js deactivateService",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	return result;
}

// ------ FEEDBACK ------

export async function getFeedbacks() {
	let result = [];

	const data = await apiCall(`feedbacks/`, "GET", false);

	if (data.errorCode === 0) {
		result = data.feedbacks;
	} else {
		console.error(
			"unhandle error in auth.js getFeedbacks",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	return result;
}

export async function createFeedback(feedback) {
	let result = false;

	const data = await apiCall(`feedbacks/`, "POST", true, feedback);

	if (data.errorCode === 0) {
		result = data.feedback || true;
		console.log("createFeedback success:", data);
	} else {
		console.error(
			"unhandle error in auth.js createFeedback",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
	}
	return result;
}
