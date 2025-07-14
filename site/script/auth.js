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

	// console.log(BASE_URL, resource);
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
		console.log("in apiCall response ", response);
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
	return JSON.parse(localStorage.getItem("user"))?.token;
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

	return {
		success: true,
		token: data.token,
		id: data.user.id,
		email: data.user.email,
		role: data.user.role,
	};
}

export async function logout(id) {
	console.log("in auth.js logout");

	// ça prend id ou non?
	const data = await apiCall(`users/logout`, "POST", true, { id });

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

	return {
		success: true,
		revoked: data.revoked,
	};
}

export async function deactivateAccount(id) {
	console.log("in auth.js deactivateAccount");

	const data = await apiCall(`users/deactivate`, "POST", true, { id });

	if (data.errorCode !== 0) {
		console.error(
			"unhandled error in auth.js deactivateAccount",
			"data.errorCode:",
			data.errorCode,
			"data:",
			data
		);
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur de désactivation",
		};
	}

	return {
		success: true,
		revoked: data.revoked,
	};
}

export async function getUsersByRole(role) {
	const data = await apiCall(`users/role/${role}`, "GET", true);

	if (data.errorCode !== 0) {
		console.error(
			"unhandled error in auth.js getUsersByRole",
			"data.errorCode:",
			data.errorCode,
			"data:",
			data
		);
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la récupération des utilisateurs par rôle",
		};
	}
	return {
		success: true,
		users: data.users
	};
}

export async function getUserIdAppointments(id) {

	const data = await apiCall(`users/${id}/appointments`, "GET", true);

	if (data.errorCode !== 0) {
		console.error(
			"unhandled error in auth.js getUserIdAppointments",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la récupération des rendez-vous"
		};
	}

	return {
		success: true,
		appointments: data.appointments
	};
}

export async function getUserIdAvailabilities(id) {

	const data = await apiCall(`users/${id}/availabilities`, "GET", true);

	if (data.errorCode !== 0) {
		console.error(
			"unhandled error in auth.js getUserIdAvailabilities",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la récupération des disponibilités"
		};
	}

	return {
		success: true,
		availabilities: data.availabilities
	};
}

// ------ APPOINTMENTS ------

export async function createAppointment(appointment) {

	const data = await apiCall(`appointments/add`, "POST", true, appointment);

	if (data.errorCode !== 0) {
		console.error(
			"unhandled error in auth.js createAppointment(appointment)",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la création du rendez-vous"
		};
	}

	return {
		success: true,
	};
}

export async function modifyAppointment(id, status) {

	const data = await apiCall(`appointments/${id}`, "PATCH", true, { status });

	if (data.errorCode !== 0) {
		console.error(
			"unhandled error in auth.js modifyAppointment",
			"data.errorCode:",
			data.errorCode,
			"data:",
			data
		);
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message
		};
	}

	return {
		success: true,
	};
}

// ------ AVAILABILITIES ------

export async function createAvailability(availability) {

	const data = await apiCall("availabilities/add", "POST", true, availability);

	if (data.errorCode !== 0) {
		console.error(
			"unhandle error in auth.js createAvailability",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);

		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la création de la disponibilité"
		};
	}
	return {
		success: true,
	};
}

export async function modifyAvailability({id, status}) {

	const data = await apiCall(`availabilities/${id}`, "PATCH", true, { status });

	if (data.errorCode !== 0) {

		console.error(
			"unhandle error in auth.js updateAvailability",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la mise à jour de la disponibilité"
		};
	}
	return {
		success: true,
	};
}

// ------ SERVICES ------

export async function getServices() {

	const data = await apiCall(`services/`, "GET", false);

	if (data.errorCode !== 0) {

		console.error(
			"unhandle error in auth.js getServices",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);

		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la récupération des services"
		};
	}

	return {
		success: true,
		services: data.services
	};
}

// ------ FEEDBACK ------

export async function getFeedbacks() {

	const data = await apiCall(`feedbacks/`, "GET", false);
	if (data.errorCode !== 0) {
		console.error(
			"unhandle error in auth.js getFeedbacks",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);

		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la récupération des feedbacks"
		};
	}

	return {
		success: true,
		feedbacks: data.feedbacks
	};
}

export async function createFeedback(feedback) {

	const data = await apiCall(`feedbacks/add`, "POST", true, feedback);

	if (data.errorCode !== 0) {

		console.error(
			"unhandle error in auth.js createFeedback",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);

		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la création du feedback"
		};
	}

	return {
		success: true,
	};
}
