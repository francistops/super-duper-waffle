import {
<<<<<<< HEAD
=======
	fetchAllUsers,
	fetchIdByEmail,
	fetchUserById,
>>>>>>> b437137231ad0ccc6e011f8d45ab8e33b6602050
	fetchByRole,
	insertUser,
	isUserValid,
	deactivateUserById,
	logoutByToken,
} from "../models/userModel.js";
import { assignToken, isTokenExist } from "../models/tokenModel.js";
import { catchMsg } from "../lib/utils.js";

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};


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
		const user = await insertUser(newUser);
		if (user) {
			result = {
				message: "Success",
				errorCode: 0
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
		console.log("checkedUser", checkedUser);
		if (checkedUser) {

			const userId = await fetchIdByEmail(email);
			const isTokenResult = await isTokenExist(userId);

			if (!isTokenResult.status) {
				const userToken = await assignToken(userId);
				const user = await fetchUserById(userId);

				result = {
					message: "Successfull login",
					errorCode: 0,
					user: {
						id: userId,
						email: user.email,
						role: user.role,
					},
					token: userToken,
				};
			} else if (isTokenResult.status) {
				result = {
					message: "already logged in",
					errorCode: 0,
					token: isTokenResult.token,
				};
			}
		} else {
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

		const userIdFromToken = req.user.id;
		const userIdFromBody = req.body.id;

		if (!userIdFromToken || !userIdFromBody || userIdFromToken !== userIdFromBody) {
		  return res.status(403).formatView({
			message: "Unauthorized logout attempt",
			errorCode: 403,
		  });
		}

		const isTokenResult = await isTokenExist(userIdFromToken);
		if (!isTokenResult.status) {
		  return res.status(404).formatView({
			message: "No active session found",
			errorCode: 404,
		  });
		}

		const logoutConfirmation = await logoutByToken(req.selectedToken.token);
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

export async function deactivateUser(req, res) {
	let result = UNKNOWN_ERROR;

	try {

		const userIdFromToken = req.user.id;
		const userIdFromBody = req.body.id;

		if (!userIdFromToken || !userIdFromBody || userIdFromToken !== userIdFromBody) {
		  return res.status(403).formatView({
			message: "Unauthorized deactivation attempt",
			errorCode: 403,
		  });
		}

		const isTokenResult = await isTokenExist(userIdFromToken);
		if (!isTokenResult.status) {
		  return res.status(404).formatView({
			message: "No active session found",
			errorCode: 404,
		  });
		}

		const deactivationConfirmation = await deactivateUserById(userIdFromBody);

		if (deactivationConfirmation) {
			const removingToken = await logoutByToken(req.selectedToken.token);
			if (!removingToken) {
				throw new Error("Failed to remove token during user deactivation.");
			}
			result = {
				message: `User ${userIdFromBody } deactivated successfully`,
				errorCode: 0,
			};
		} else {
			result = {
				message: `Failed to deactivate user ${userIdFromBody}`,
				errorCode: 1,
			};
		}
	} catch (error) {
		catchMsg(`user deactivateUser ${req.user?.id}`, error, res, result);
	}

	res.formatView(result);
}
