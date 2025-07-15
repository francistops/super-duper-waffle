import {
	fetchIdByEmail,
	fetchUserById,
	fetchByRole,
	insertUser,
	isUserValid,
	deactivateUserById,
	logoutByToken,
} from "../models/userModel.js";
import { fetchUserIdAppointments } from "../models/appointmentModel.js";
import { fetchUserIdAvailabilities } from "../models/availabilityModel.js";
import { assignToken, isTokenExist } from "../models/tokenModel.js";
import { catchMsg, assertSameUserOrThrow } from "../lib/utils.js";
import { makeSuccess, makeError } from "../utils/resultFactory.js";

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};

<<<<<<< HEAD
// already in debugCtrl same reason as the one for the model
// unleast you need it to be display or internal feature
// it should be in debug i believe
// export async function getAllUsers(req, res) {

=======
>>>>>>> 28127b2 (Sorry j'étais sur le main, check dans readme pour voir ce qui fonctionne, je viens de penser que dans appointment controller il faut que je gère que c'est un token de client qui peut add ou modify un appointment, je ne l'ai pas fais encore)
export async function getUsersByRole(req, res) {
	let result = makeError();
	const role = req.body.role;
	
	try {
		const validRoles = ["hairdresser", "client"];
		if (!role || !validRoles.includes(role)) throw new Error(`Invalid or missing role: 
			must be one of ${validRoles.join(", ")}`);
		
		const users = await fetchByRole(role);

		if (users) makeSuccess({ users: users }, "Users retrieved successfully")
		else makeError("Failed to retrieve users", 1)

	} catch (error) {
		catchMsg(`user getUsersByRole ${req.params}`, error, res, result, 500);
	}
	res.formatView(result);
}

// the below is valid but just not how we did things until now see above for example
// i'm talking about returning asap instead of once.
// also you must pick a way are using result formatview or catchmsg and the way you format your return
// if you are confuse why, come talk to me
export async function getUserIdAppointments(req, res) {
	const result = makeError();
	const userIdFromToken = req.user.id; // this exist?
	const userIdFromParams = req.params.id;

	try {
		assertSameUserOrThrow(userIdFromParams, userIdFromToken);

		const isTokenResult = await isTokenExist(userIdFromToken);

		if (!isTokenResult.status) {
		  return res.status(404).formatView({
			message: "No active session found",
			errorCode: 404,
		  });
		}

		const appointments = await fetchUserIdAppointments(userIdFromToken);
		if (!appointments) {
			return res.status(404).formatView({
				message: `No appointments found for user ${userIdFromToken}`,
				errorCode: 404,
			});
		}

		return res.formatView({
			message: "Success",
			errorCode: 0,
			appointment: appointments,
		});
	} catch (error) {
		if (error.statusCode === 403) {
			return res.status(403).formatView({
				message: error.message,
				errorCode: 403,
			});
		}

		catchMsg(`appointment getUserIdAppointments ${req.body}`, error, res, result);
		res.formatView(result);
	}
}

export async function getUserIdAvailabilities(req, res) {
	let result = UNKNOWN_ERROR;

	try {
		const userIdFromToken = req.user.id;
		const userIdFromParams = req.params.id;
		
		assertSameUserOrThrow(userIdFromParams, userIdFromToken);
		
		const isTokenResult = await isTokenExist(userIdFromToken);

		if (!isTokenResult.status) {
		  return res.status(404).formatView({
			message: "No active session found",
			errorCode: 404,
		  });
		}

		const availability = await fetchUserIdAvailabilities(userIdFromToken);

		if (!availability) {
			return res.status(404).formatView({
				message: `No availabilities found for user ${userIdFromToken}`,
				errorCode: 404,
			});
		}

		result = {
			message: "Success",
			errorCode: 0,
			availability: availability,
		};
	} catch (error) {
		catchMsg(
			`appointment getUserIdAvailabilities ${req.body}`,
			error,
			res,
			result
		);
	}
	res.formatView(result);
}

export async function registerUser(req, res) {
	let result = UNKNOWN_ERROR;
	const newUser = req.body;
	console.log("newUser", newUser);

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
		if (error.code === '23505') {
			result = {
				message: "Email déjà utilisé",
				errorCode: 2
			};
			res.formatView(result);
			return;
		}
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

		const userId  = req.body.id;

		if (!userId) {
			return res.status(400).formatView({
				message: "User not authenticated",
				errorCode: 400,
			});
		}
		
		const isTokenResult = await isTokenExist(userId);

		if (!isTokenResult.status) {
		  return res.status(404).formatView({
			message: "No active session found",
			errorCode: 404,
		  });
		}

		const logoutConfirmation = await logoutByToken(req.selectedToken.token);

		if (logoutConfirmation) {
			result = {
				message: "Logout successful",
				errorCode: 0,
			};
		} else {
			result = {
				message: "Logout failed",
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

		assertSameUserOrThrow(userIdFromBody, userIdFromToken);

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
