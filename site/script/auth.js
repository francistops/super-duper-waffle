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

	const response = await fetch(apiUrl, apiReq);

	if (response.ok) {
		result = await response.json();
	}

	return result;
}

// ------ Users ------

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

	const logoutJson = await apiCall("users/logout", "POST", true);

	if (logoutJson.errorCode == 0) {
		result = logoutJson.revoked;
		localStorage.clear();
	}
	return result;
}

export async function deleteAccount() {
	console.log("in auth.js deleteAccount");
	let result = false;

	const data = await apiCall("users/delete", "DELETE", true);
	if (data.errorCode == 0) {
		result = true;
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
		const data = await apiCall(`appointments/`, "GET", false);

		if (data.errorCode === 0) {
			result = data.appointments;
		} else {
			console.error(
				"unhandle error in auth.js getAppointmentsByRole",
				data.errorCode
			);
		}
	} catch (error) {
		console.error("Erreur réseau getFeedbacks:", error);
	}

	return result;
}

// ------ SERVICES ------

export async function addNextService(service) {
	console.log("in auth.js addNextService", service);
	let result = false;

	const data = await apiCall("service/add", "POST", true, service);
	if (data.errorCode == 0) {
		result = true;
		console.log("addNextService success", data);
	} else {
		console.error("unhandle error in auth.js addNextService", data);
	}

	return result;
}

// ------ FEEDBACK ------
