import { makeError, makeSuccess } from "../utils/resultFactory.js";

import {
	fetchUsers,
	fetchTokens,
	fetchUserById,
	fetchAvailabilities,
	fetchAppointments,
	fetchFeedbacks,
} from "../models/debugModel.js";

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

export async function getAvailabilities(req, res) {
	let result = makeError();
	try {
		const availabilities = await fetchAvailabilities();
		result = makeSuccess({ availabilities: availabilities });
	} catch (error) {
		res.status(400);
		result = makeError(`Error retrieving availabilities: ${error}`, 1004);
	}
	res.formatView(result);
}

export async function getAppointments(req, res) {
	let result = UNKNOWN_ERROR;
	try {
		const appointments = await fetchAppointments();
		if (!appointments || appointments.length === 0) {
			return res.status(404).formatView({
				message: "No appointments found",
				errorCode: 404,
			});
		}
		result = {
			message: "Success",
			errorCode: 0,
			appointments: appointments,
		};
	} catch (error) {
		catchMsg(`appointment getAppointments`, error, res, result);
	}
	res.formatView(result);
}

export async function getFeedbacks(req, res) {
	let result = makeError();
	try {
		const feedbacks = await fetchFeedbacks();
		result = makeSuccess({ feedbacks: feedbacks });
	} catch (error) {
		res.status(400);
		result = makeError(`Error retrieving feedbacks: ${error}`, 1001);
	}
	res.formatView(result);
}
