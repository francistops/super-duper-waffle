import {
	fetchAllUsers,
	fetchUserById,
	fetchByRole,
	insertUser,
	isUserValid,
	fetchIdByEmail,
	logoutByToken,
	deleteUser,
} from "../models/userModel.js";
import { assignToken, isTokenExist } from "../models/tokenModel.js";
import { catchMsg } from "../lib/utils.js";

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};

export async function getAllUsers(req, res) {
	let result = UNKNOWN_ERROR;
	try {
		const users = await fetchAllUsers();
		result = {
			message: "Success",
			errorCode: 0,
			users: users,
		};
	} catch (error) {
		catchMsg(`user getAllUsers`, error, res, result);
	}
	res.formatView(result);
}

// todo change param for req.body
export async function getUserById(req, res) {
	let result = UNKNOWN_ERROR;
	const { id } = req.params;
	try {
		const user = await fetchUserById(id);
		result = {
			message: "Success",
			errorCode: 0,
			user: user,
		};
	} catch (error) {
		catchMsg(`user getUserById ${id}`, error, res, result);
	}
	res.formatView(result);
}

// todo change param for req.body
export async function getUsersByRole(req, res) {
	let result = UNKNOWN_ERROR;

	const { role: role } = req.params;
	try {
		const users = await fetchByRole(role);
		if (users) {
			result = {
				message: "Users retrieved successfully",
				errorCode: 0,
				users: users,
			};
		} else {
			result = {
				message: "Failed to retrieve users",
				errorCode: 1,
			};
		}
	} catch (error) {
		catchMsg(`user getUsersByRole ${req.params}`, error, res, result);
	}

	res.formatView(result);
}

export async function registerUser(req, res) {
	let result = UNKNOWN_ERROR;
	const newUser = req.body;
	try {
		const success = await insertUser(newUser);
		if (success) {
			result = {
				message: "Success",
				errorCode: 0,
			};
		} else {
			result = {
				message: "fail",
				errorCode: 1,
			};
		}
	} catch (error) {
		catchMsg(`user registerUser ${req.body}`, error, res, result);
	}
	res.formatView(result);
}

//todo in auth.js minimize api call
export async function loginUser(req, res) {
	let result = UNKNOWN_ERROR;
	const { email: email, passhash: passHash } = req.body;
	try {
		const checkedUser = await isUserValid(email, passHash);
		if (checkedUser) {
			const userid = await fetchIdByEmail(email);
			const isTokenResult = await isTokenExist(userid);
			if (!isTokenResult.status) {
				const userToken = await assignToken(userid);
				result = {
					message: "Successfull login",
					errorCode: 0,
					user: userid,
					token: userToken,
				};
			} else if (isTokenResult.status) {
				result = {
					message: "already logged in",
					errorCode: 0,
					// user: loggedUser,
					token: isTokenResult.token,
				};
			}
		} else {
			// we only want to catch and throw errors from the backend here hence an user invalid auth is not handled here
			// tho we return result that will the frontend it failed
			result = {
				message: "Invalid credentials",
				errorCode: 401,
			};
			res.status(401);
		}
	} catch (error) {
		catchMsg(`user loginUser ${req.body.email}`, error, res, result);
	}

	res.formatView(result);
}

export async function logoutUser(req, res) {
	let result = UNKNOWN_ERROR;
	try {
		const logoutConfirmation = await logoutByToken(req.selectedToken);
		if (logoutConfirmation) {
			result = {
				message: "Success",
				errorCode: 0,
			};
		} else {
			result = {
				message: "Failed",
				errorCode: 1,
			};
		}
	} catch (error) {
		catchMsg(`user logoutUser ${req.selectedToken}`, error, res, result);
	}
	res.formatView(result);
}

// todo user can only delete himself like remove user by token
export async function removeUser(req, res) {
	let result = UNKNOWN_ERROR;

	const { id } = req.body;

	try {
		const success = await deleteUser(id);
		if (success) {
			result = {
				message: `User ${id} deleted successfully`,
				errorCode: 0,
			};
		} else {
			result = {
				message: `Failed to delete user ${id}`,
				errorCode: 1,
			};
		}
	} catch (error) {
		catchMsg(`user deleteUser ${id}`, error, res, result);
	}

	res.formatView(result);
}
