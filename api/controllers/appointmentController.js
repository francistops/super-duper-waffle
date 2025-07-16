import {
	insertAppointment,
	updateAppointment,
	isAppointmentExist,
} from "../models/appointmentModel.js";
import { callModel, catchMsg } from "../lib/utils.js";
import { makeError, makeSuccess } from "../utils/resultFactory.js";

export async function addAppointment(req, res) {
	let result = makeError();

	try {
		if (req.user.role !== "client") {
			return sendError(res, 403, "Only clients can add appointments");
		}

		const { client_id, service_id, availability_id } = req.body;

		if (!availability_id || !service_id || !client_id) {
			return sendError(
				res,
				400,
				"Missing availability_id, service_id, or client_id",
				1
			);
		}

		if (new Date(appointment_date) < new Date()) {
			return sendError(res, 400, "Appointment date cannot be in the past");
		}

		const alreadyExists = await isAppointmentExist({
			client_id: req.user.id,
			service_id: service_id,
			availability_id: hairdresser_id,
		});

		if (alreadyExists) {
			return sendError(
				res,
				409,
				"Appointment already exists for this date, hairdresser, and service"
			);
		}

		const appointment = await insertAppointment({
			hairdresser_id,
			appointment_date,
			service_id,
		});
		result = makeSuccess({ appointment }, "Appointment added successfully");
	} catch (error) {
		catchMsg(`appointment addAppointment ${req.body}`, error, res, result);
	}
	res.formatView(result);
}

export async function modifyAppointment(req, res) {
	let result = makeError();

	try {
		const appointmentId = req.params.id;
		const appointmentNewStatus = req.body.status;

		if (
			!["pending", "show", "noShow", "feedback"].includes(appointmentNewStatus)
		) {
			return sendError(res, 400, "Invalid appointment status");
		}

		if (!appointmentId || !appointmentNewStatus) {
			return sendError(res, 400, "Missing id or status", 1);
		}

		if (req.user.role !== "client") {
			return sendError(res, 403, "Only clients can modify appointments");
		}

		const appointment = await isAppointmentExist({ appointmentId });
		if (!appointment) {
			return sendError(res, 404, "Appointment not found");
		}

		await callModel(
			res,
			74,
			updateAppointment,
			"appointment",
			appointmentId,
			appointmentNewStatus
		);

		result = makeSuccess({ appointment }, "Appointment updated successfully");
	} catch (error) {
		catchMsg(`appointment updateAppointment ${req.body}`, error, res, result);
		return res.formatView(result);
	}
	res.formatView(result);
}
