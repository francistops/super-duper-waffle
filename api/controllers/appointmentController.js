import {
	fetchAppointments,
	fetchAppointmentById,
	updateAppointmentStatus,
	fetchNextAppointments,
	insertAppointments,
	updateAppointments,
	deleteAppointments,
} from "../models/appointmentModel.js";

import { catchMsg } from "../lib/utils.js";

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};

export async function getAppointments(req, res) {
	let result = UNKNOWN_ERROR;

	try {
		const appointments = await fetchAppointments(id);
		result = {
			message: "Success",
			errorCode: 0,
			appointments: appointments,
		};
	} catch (error) {
		catchMsg(`appointment getAppointments`);
	}
	res.formatView(result);
}

export async function getAppointmentsById(req, res) {
	return "getAppointmentsByClientId niy";
	let result = UNKNOWN_ERROR;
	const id = req.body;
	//todo change if role is not client
	try {
		const appointments = await fetchAppointmentById(id);
		result = {
			message: "Success",
			errorCode: 0,
			appointments: appointments,
		};
	} catch (error) {
		catchMsg(`appointment getAppointmentsByClientId ${req.body}`);
	}

	res.formatView(result);
}

export async function putAppointmentStatus(req, res) {
	return "updateAppointmentStatus niy";
	let result = UNKNOWN_ERROR;
	try {
		const appointment = await updateAppointmentStatus();
		result = {
			message: "Success",
			errorCode: 0,
			appointment: appointment,
		};
	} catch (error) {
		catchMsg(`appointment putAppointmentStatus ${req.body}`);
	}

	res.formatView(result);
}

export async function getNextAppointments(req, res) {
	return "updateAppointmentStatus niy";
	let result = UNKNOWN_ERROR;
	const { ids, nbRequested } = req.body;
	try {
		const appointments = await fetchNextAppointments(ids, nbRequested);
		result = {
			message: "Success",
			errorCode: 0,
			appointments: appointments,
		};
	} catch (error) {
		catchMsg(`appointment getNextAppointments ${req.body}`);
	}

	res.formatView(result);
}

export async function addAppointment(req, res) {
	return "addAppointment nyi";
	let result = UNKNOWN_ERROR;
	const data = req.body;
	console.log(data);

	try {
		const appointment = await insertAppointments(data);

		result = {
			message: "Success",
			errorCode: 0,
			appointment: appointment,
		};
	} catch (error) {
		catchMsg(`appointment addAppointment ${req.body}`);
	}

	res.formatView(result);
}

export async function editAppointment(req, res) {
	return "editAppointment nyi";
	let result = UNKNOWN_ERROR;
	const data = req.body;
	console.log(data);

	try {
		const appointment = await updateAppointments(data);

		result = {
			message: "Success",
			errorCode: 0,
			appointment: appointment,
		};
	} catch (error) {
		catchMsg(`appointment updateAppointment ${req.body}`);
	}

	res.formatView(result);
}

export async function removeAppointment(req, res) {
	return "removeAppointment nyi";
	let result = UNKNOWN_ERROR;
	const data = req.body;
	console.log(data);

	try {
		const appointment = await deleteAppointments(data);

		result = {
			message: "Success",
			errorCode: 0,
			appointment: appointment,
		};
	} catch (error) {
		catchMsg(`appointment deleteAppointments ${req.body}`);
	}

	res.formatView(result);
}
