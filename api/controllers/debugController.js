import { sendError, sendSuccess } from "../utils/resultFactory.js";

import {
	fetchUsers,
	fetchTokens,
	fetchUserById,
	fetchAvailabilities,
	fetchAppointments,
} from "../models/debugModel.js";

export async function getUsers(req, res) {
	try {
		const users = await fetchUsers();
		return sendSuccess({ users: users });
	} catch (error) {
		res.status(400);
		return sendError(`Error retrieving users: ${error}`, 1001);
	}
}

export async function getTokens(req, res) {
	try {
		const tokens = await fetchTokens();
		return sendSuccess({ tokens: tokens });
	} catch (error) {
		res.status(400);
		return sendError(`Error retrieving token: ${error}`, 1002);
	}
}

export async function getUserById(req, res) {
	const { id } = req.params;
	try {
		const user = await fetchUserById(id);
		return sendSuccess({ user: user });
	} catch (error) {
		res.status(400);
		return sendError(`Error retrieving user with id ${id}`, 1003);
	}
}

export async function getAvailabilities(req, res) {
	try {
		const availabilities = await fetchAvailabilities();
		return sendSuccess({ availabilities: availabilities });
	} catch (error) {
		res.status(400);
		return sendError(`Error retrieving availabilities: ${error}`, 1004);
	}
}

export async function getAppointments(req, res) {
	try {
		const appointments = await fetchAppointments();
		if (!appointments || appointments.length === 0) {
			return sendError(res, 404, "No appointments found");
		}
		return sendSuccess({ appointments: appointments });
	} catch (error) {
		return catchMsg(`appointment getAppointments`, error, res);
	}
}
