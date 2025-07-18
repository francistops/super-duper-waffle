import {
	fetchByRole,
	insertUser,
	isUserExist,
	deactivateUserById,
	logoutByToken,
} from "../models/userModel.js";
import { fetchUserIdAppointments } from "../models/appointmentModel.js";
import { fetchUserIdAvailabilities } from "../models/availabilityModel.js";
import { assignToken } from "../models/tokenModel.js";
import { catchMsg, assertSameUserOrThrow } from "../lib/utils.js";
import { makeSuccess, makeError } from "../utils/resultFactory.js";

export async function getUsersByRole(req, res) {
	let result = makeError();
	const role = req.params.role;

	try {
		const validRoles = ["hairdresser", "client"];
		if (!role || !validRoles.includes(role))
			result = makeError("Invalid role specified", 1);
		else { 
			const users = await fetchByRole(role);

		// if (Array.isArray(users)) {
			result = makeSuccess({ users }, "Users retrieved successfully");
		// } else {
		// 	result = makeError("Failed to retrieve users", 1);
		}
	} catch (error) {
		return catchMsg(
			`user getUsersByRole ${req.params}`,
			error,
			res,
			result,
			500
		);
	}
	res.formatView(result);
}

export async function getUserIdAppointments(req, res) {
	let result = makeError();

	try {
		const appointments = await fetchUserIdAppointments(req.params.id);

		if (!appointments || appointments.length === 0) {
			result = makeError("No appointments found for this user", 1);
			return res.status(404).formatView(result);
		}

		result = makeSuccess(
			{ appointments },
			"Appointments retrieved successfully"
		);
	} catch (error) {
		result = makeError("Failed to retrieve appointments", 1);
		return catchMsg(
			`user getUserIdAppointments ${req.params}`,
			error,
			res,
			result
		);
	}
	res.formatView(result);
}

export async function getUserIdAvailabilities(req, res) {
	let result = makeError();

	try {
		const availability = await fetchUserIdAvailabilities(req.params.id);
		result = makeSuccess(
			{ availability },
			"User's availabilities retrieved successfully"
		);
	} catch (error) {
		result = makeError("Failed to retrieve availabilities", 1);
		return catchMsg(
			`user getUserIdAvailabilities ${req.params}`,
			error,
			res,
			result
		);
	}
	res.formatView(result);
}

export async function registerUser(req, res) {
	let result = makeError();

	try {
		const user = await insertUser(req.body);
		console.error(`user registerUser ${req.body}`, user);
		if (user) {
			result = makeSuccess({ user }, "User registered successfully");
		} else {
			result = makeError("User registration failed");
		}
	} catch (error) {
		if (error.code === "23505") {
			result = makeError("Email déjà utilisé", 2);
		} else {
			result = makeError("User registration failed", 1);
			return catchMsg(`user registerUser ${req.body}`, error, res, result);
		}
	}
	res.formatView(result);
}

export async function loginUser(req, res) {
	let result = makeError();
	const { email: email, passhash: passHash } = req.body;

	try {
		const checkedUser = await isUserExist(email, passHash);

		if (checkedUser) {
			const userToken = await assignToken(checkedUser.id);
			result = makeSuccess(
				{
					user: {
						id: checkedUser.id,
						email: checkedUser.email,
						role: checkedUser.role,
					},
					token: userToken,
				},
				"User logged in successfully"
			);
		} else {
			result = makeError({
				message: "already logged in",
				errorCode: 401,
			});
		}
	} catch (error) {
		result = makeError("Login failed", 1);
		if (error.code === "23505") {
			result = makeError("Email already used", 2);
		} else if (error.code === "23502") {
			result = makeError("Email or password missing", 3);
		}
		return catchMsg(`user loginUser ${req.body.email}`, error, res, result);
	}
	res.formatView(result);
}

export async function logoutUser(req, res) {
	let result = makeError();

	try {
		const logoutConfirmation = await logoutByToken(req.selectedToken.token);

		if (logoutConfirmation) {
			result = makeSuccess({}, "User logged out successfully");
		} else {
			result = makeError("Logout failed");
		}
	} catch (error) {
		result = makeError("Logout failed", 1);
		if (error.code === "23503") {
			result = makeError("Token not found or already removed", 2);
		} else if (error.code === "23505") {
			result = makeError("Token already removed", 3);
		}
		return catchMsg(`user logoutUser ${req.user.id}`, error, res, result);
	}
	res.formatView(result);
}

export async function deactivateUser(req, res) {
	let result = makeError();

	try {
		const deactivationConfirmation = await deactivateUserById(req.user.id);

		if (deactivationConfirmation) {
			const removingToken = await logoutByToken(req.selectedToken.token);
			if (!removingToken) {
				result = makeError("Failed to remove token during deactivation", 1);
			}
			result = makeSuccess({}, "User deactivated successfully");
		} else {
			result = makeError(`Failed to deactivate user ${userIdFromBody}`, 1);
		}
	} catch (error) {
		return catchMsg(`user deactivateUser ${req.user?.id}`, error, res, result);
	}
	res.formatView(result);
}
