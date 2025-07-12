import { catchMsg } from "../lib/utils.js";

import { fetchUsers, fetchTokens, fetchUserById } from "../models/debugModel.js"

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
