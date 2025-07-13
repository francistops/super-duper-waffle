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
		role: data.user.role,
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

	return {
		success: true,
		revoked: data.revoked,
	};
}

export async function deactivateAccount(id) {
	console.log("in auth.js deactivateAccount");

	const data = await apiCall("users/deactivate", "POST", true, { id });

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

	const data = await apiCall(`appointments/`, "POST", true, appointment);

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

export async function getAvailabilitiesByUserId(userId) {

	const data = await apiCall(`users/${userId}/availabilities`, "GET", true);

	if (data.errorCode !== 0) {
		console.error(
			"unhandle error in auth.js getAvailabilitiesByUserId",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la récupération des disponibilités par utilisateur"
		};
	}
	return {
		success: true,
		availabilities: data.availabilities
	};
}

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

	const data = await apiCall(`availabilities/${id}`, "POST", true, { status });

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

export async function createService(service) {

	const data = await apiCall(`services/`, "POST", true, service);

	if (data.errorCode !== 0) {

		console.error(
			"unhandle error in auth.js createService",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);
		
		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la création du service"
		};
	}
	return {
		success: true,
	};
}

export async function updateService(id, service) {

	const data = await apiCall(`services/${id}`, "POST", true, service);

	if (data.errorCode !== 0) {

		console.error(
			"unhandle error in auth.js updateService",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);

		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la mise à jour du service"
		};
	}
	return {
		success: true,
	};
}

export async function deactivateService(id) {

	const data = await apiCall(`services/${id}`, "POST", true, id);

	if (data.errorCode !== 0) {

		console.error(
			"unhandle error in auth.js deactivateService",
			"data.errorCode: ",
			data.errorCode,
			" data : ",
			data
		);

		return {
			success: false,
			errorCode: data.errorCode,
			message: data.message ?? "Erreur lors de la désactivation du service"
		};
	}
	return {
		success: true,
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

	const data = await apiCall(`feedbacks/`, "POST", true, feedback);

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


// ---- staging logging test ----
// Frontend logger function (client-side)
const logFrontendError = async (message, stackTrace) => {
	try {
		await fetch('/logs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				level: 'ERROR',
				message: message,
				stackTrace: stackTrace,
				userAgent: navigator.userAgent,
			}),
		});
	} catch (err) {
		console.error('Error sending log to server:', err);
	}
};

// Example of logging an error on the frontend
window.onerror = function (message, source, lineno, colno, error) {
	logFrontendError(message, error.stack);
	return true; // Prevents the default browser error handling
};