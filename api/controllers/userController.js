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
import { sendError, sendSuccess } from "../utils/resultFactory.js";

export async function getUsersByRole(req, res) {
	const role = req.params.role;

	try {
		const validRoles = ["hairdresser", "client"];
		if (!role || !validRoles.includes(role))
			return sendError(res, 400, "Invalid role specified");

		const users = await fetchByRole(role);

		if (Array.isArray(users)) {
			return sendSuccess(res, { users }, "Users retrieved successfully");
		} else {
			return sendError(res, 500, "Failed to retrieve users");
		}
	} catch (error) {
		return catchMsg(`user getUsersByRole`, error, res);
	}
}

export async function getUserIdAppointments(req, res) {
	try {
		const appointments = await fetchUserIdAppointments(req.params.id);

		if (!appointments || appointments.length === 0) {
			return sendError(res, 404, "No appointments found for this user");
		}

		return sendSuccess(
			res,
			{ appointments },
			"Appointments retrieved successfully"
		);
	} catch (error) {
		return catchMsg(`user getUserIdAppointments`, error, res);
	}
}

export async function getUserIdAvailabilities(req, res) {
	try {
		const availability = await fetchUserIdAvailabilities(req.params.id);

		if (!availability || availability.length === 0) {
			return sendError(res, 404, "No availabilities found for this user");
		}

		return sendSuccess(
			res,
			{ availability },
			"User's availabilities retrieved successfully"
		);
	} catch (error) {
		return catchMsg(`user getUserIdAvailabilities`, error, res);
	}
}

export async function registerUser(req, res) {
	try {
		const user = await insertUser(req.body);
		if (user) {
			return sendSuccess(res, { user }, "User registered successfully");
		} else {
			return sendError(res, 500, "User registration failed");
		}
	} catch (error) {
		if (error.code === "23505") {
			return sendError(res, 400, "Email déjà utilisé");
		} else {
			return catchMsg(`user registerUser`, error, res);
		}
	}
}

export async function loginUser(req, res) {
	const { email: email, passhash: passHash } = req.body;

	try {
		const checkedUser = await isUserExist(email, passHash);

		if (checkedUser) {
			const userToken = await assignToken(checkedUser.id);
			return sendSuccess(
				res,
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
			return sendError(res, 401, "already logged in");
		}
	} catch (error) {
		return catchMsg(`user loginUser`, error, res);
	}
}

export async function logoutUser(req, res) {
	try {
		const logoutConfirmation = await logoutByToken(req.selectedToken.token);

		if (logoutConfirmation) {
			return sendSuccess(res, {}, "User logged out successfully");
		} else {
			return sendError(res, 500, "Logout failed");
		}
	} catch (error) {
		return catchMsg(`user logoutUser`, error, res);
	}
}

export async function deactivateUser(req, res) {
	try {
		const deactivationConfirmation = await deactivateUserById(req.user.id);

		if (deactivationConfirmation) {
			const removingToken = await logoutByToken(req.selectedToken.token);
			if (!removingToken) {
				return sendError(
					res,
					500,
					"Failed to remove token during deactivation"
				);
			}
			return sendSuccess(res, {}, "User deactivated successfully");
		} else {
			return sendError(
				res,
				500,
				`Failed to deactivate user with id ${req.user.id}`
			);
		}
	} catch (error) {
		return catchMsg(`user deactivateUser`, error, res);
	}
}
