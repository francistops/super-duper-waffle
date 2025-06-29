import { fetchUsers, fetchTokens } from "../models/debugModel.js";

import { catchMsg } from "../lib/utils.js";
// catchMsg(name, errorHttp, errorObj, res, result)

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};

export async function getUsers(req, res) {
	let result = UNKNOWN_ERROR;
	try {
		const users = await fetchUsers();
		result = {
			message: "Success",
			errorCode: 0,
			users: users,
		};
	} catch (error) {
		catchMsg("debug getUsers");
	}
	res.formatView(result);
}

export async function getTokens(req, res) {
	let result = UNKNOWN_ERROR;
	try {
		const tokens = await fetchTokens();
		result = {
			message: "Success",
			errorCode: 0,
			tokens: tokens,
		};
	} catch (error) {
		catchMsg("debug getTokens");
	}
	res.formatView(result);
}

export async function registerUser(req, res) {
	console.log("---in userController registerUser---");
	let result = UNKNOWN_ERROR;
	const newUser = req.body;
	// console.log(newUser);
	try {
		const createdUser = await insertUser(newUser);
		console.log("after model", createdUser);
		result = {
			message: "Success",
			errorCode: 0,
		};
	} catch (error) {
		console.error("Error inserting user:", error);
		res.status(500);
		result.message = `Error inserting user`;
		result.errorCode = 1002;
	}
	res.formatView(result);
}
