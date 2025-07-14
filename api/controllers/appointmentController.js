import {
	fetchAppointments,
	insertAppointment,
	updateAppointment,
	isAppointmentExist
} from "../models/appointmentModel.js";
import { catchMsg, assertSameUserOrThrow } from "../lib/utils.js";
import { isTokenExist } from "../models/tokenModel.js";

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};

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
	console.log("in getAppointments controller" + result);
	res.formatView(result);
}

export async function addAppointment(req, res) {
	let result = UNKNOWN_ERROR;
	const newAppointment = req.body;
	console.log("newAppointment in addAppointment controller:", newAppointment);

	try {
		const appointment = await insertAppointment(newAppointment);

		result = {
			message: "Success",
			errorCode: 0,
			appointment: appointment,
		};
	} catch (error) {
		catchMsg(`appointment addAppointment`, error, res, result);
	}
	res.formatView(result);
}

export async function modifyAppointment(req, res) {
	let result = UNKNOWN_ERROR;
	const id = req.body.id;
	try {
		const appointment = await updateAppointment(id);

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