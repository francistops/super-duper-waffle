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
	} else {
		result = {
			errorCode: response.status,
			message: response.statusText,
		};
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

	const deleteAccountJson = await apiCall("users/delete", "DELETE", true);
	if (deleteAccountJson.errorCode == 0) {
		result = deleteAccountJson.revoked;
		localStorage.clear();

		console.log("deleteAccount success", deleteAccountJson);
	} else {
		console.error("unhandle error in auth.js deleteAccount", deleteAccountJson);
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

// ------ SERVICES/PRODUCTS ------

// export async function getServices() {
// 	let result = [];

// 	try {
// 		const data = await apiCall(`services/`, "GET", false);

// 		if (data.errorCode === 0) {
// 			result = data.service;
// 		} else {
// 			console.error("unhandle error in auth.js getservices", data.errorCode);
// 		}
// 	} catch (error) {
// 		console.error("Erreur réseau getServices:", error);
// 	}
// 	console.log(result + "auth.js getServices");
// 	return result;
// }

// ------ FEEDBACK ------

// export async function getFeedbacks() {
// 	let result = [];

// 	try {
// 		const data = await apiCall(`feedbacks/`, "GET", false);

// 		if (data.errorCode === 0) {
// 			result = data.feedback;
// 		} else {
// 			console.error("unhandle error in auth.js getFeedbacks", data.errorCode);
// 		}
// 	} catch (error) {
// 		console.error("Erreur réseau getFeedbacks:", error);
// 	}
// 	console.log(result + "auth.js getFeedbacks");
// 	return result;
// }

// ------ PRODUCTS ------

// export async function getProducts() {
// 	let result = [];

// 	try {
// 		const data = await apiCall(`products/`, "GET", false);

// 		if (data.errorCode === 0) {
// 			result = data.product;
// 		} else {
// 			console.error("unhandle error in auth.js getProducts", data.errorCode);
// 		}
// 	} catch (error) {
// 		console.error("Erreur réseau getProducts:", error);
// 	}
// 	console.log(result + "auth.js getProducts");
// 	return result;
// }
