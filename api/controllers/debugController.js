import { catchMsg } from "../lib/utils.js";

import {fetchUsers, fetchTokens} from "../models/debugModel.js"

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
		catchMsg("debug getUsers", error, res, result);
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
		catchMsg("debug getTokens", error, res, result);
	}
	res.formatView(result);
}