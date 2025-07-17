import {
	insertAppointment,
	updateAppointment,
	isAppointmentExist,
} from "../models/appointmentModel.js";
import { callModel, catchMsg } from "../lib/utils.js";
import { sendSuccess, sendError } from "../utils/resultFactory.js";
import { client } from "../config/db.js";

export async function addAppointment(req, res) {
	try {
		if (req.user.role !== "client") {
			return sendError(res, 403, "Only clients can add appointments");
		}

		const { service_id, availability_id } = req.body;

		if (!availability_id || !service_id) {
			return sendError(res, 400, "Missing availability_id or service_id");
		}

		const alreadyExists = await isAppointmentExist({
			client_id: req.user.id,
			service_id: service_id,
			availability_id: availability_id,
		});

		if (alreadyExists) {
			return sendError(
				res,
				409,
				"Appointment already exists for this client, availability, and service"
			);
		}

		const appointment = await insertAppointment({
			client_id: req.user.id,
			availability_id: availability_id,
			service_id: service_id,
		});
		return sendSuccess(
			res,
			{ appointment },
			"Appointment added successfully",
			1
		);
	} catch (error) {
		catchMsg(`appointment addAppointment`, error, res);
	}
}

export async function modifyAppointment(req, res) {
	try {
		const appointmentId = req.params.id;
		const appointmentNewStatus = req.body.status;

		if (
			!["pending", "show", "noShow", "feedback"].includes(appointmentNewStatus)
		) {
			return sendError(res, 400, "Invalid appointment status");
		}

		if (!appointmentId || !appointmentNewStatus) {
			return sendError(res, 400, "Missing id or status");
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

		return sendSuccess(res, { appointment });
	} catch (error) {
		catchMsg(`appointment updateAppointment`, error, res);
	}
}
