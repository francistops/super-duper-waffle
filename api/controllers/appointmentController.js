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
		const appointments = await fetchAppointments();
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

export async function getAppointmentsById(req, res) {
	let result = UNKNOWN_ERROR;
	const id = req.body;
	try {
		const appointment = await fetchAppointmentById(id);
		result = {
			message: "Success",
			errorCode: 0,
			appointment: appointment,
		};
	} catch (error) {
		catchMsg(`appointment getAppointmentsByClientId ${req.body}`, error, res, result);
	}

	res.formatView(result);
}

export async function putAppointmentStatus(req, res) {
	let result = UNKNOWN_ERROR;
	const id = req.body;
	try {
		const appointment = await updateAppointmentStatus(id);
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
	let result = UNKNOWN_ERROR;
	const newAppointment = req.body;
	try {
		const appointment = await insertAppointments(newAppointment);

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
	let result = UNKNOWN_ERROR;
	const id = req.body;
	try {
		const appointment = await updateAppointments(id);
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
	let result = UNKNOWN_ERROR;
	const id = req.body;
	try {
		const appointment = await deleteAppointments(id);
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
