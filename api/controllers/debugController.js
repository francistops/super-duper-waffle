import { makeError, makeSuccess } from '../utils/resultFactory.js';

import { fetchUsers, fetchTokens, fetchUserById } from "../models/debugModel.js"

export async function getUsers(req, res) {
	let result = makeError();
	try {
		const users = await fetchUsers();
		result = makeSuccess({ users: users });
	} catch (error) {
		res.status(400);
		result = makeError(`Error retrieving users: ${error}`, 1001);
	}
	res.formatView(result);
}

export async function getTokens(req, res) {
	let result = makeError();
	try {
		const tokens = await fetchTokens();
		result = makeSuccess({ tokens: tokens });
	} catch (error) {
		res.status(400);
		result = makeError(`Error retrieving token: ${error}`, 1002);
	}
	res.formatView(result);
}

export async function getUserById(req, res) {
	let result = makeError();
	const { id } = req.params;
	try {
		const user = await fetchUserById(id);
		result = makeSuccess({ user: user });
	} catch (error) {
		res.status(400);
		result = makeError(`Error retrieving user with id ${id}`, 1003);
	}
	res.formatView(result);
}
