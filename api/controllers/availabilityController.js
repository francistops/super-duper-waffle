import {
	insertAvailability,
	updateAvailability,
	isAvailabilityExistById,
} from "../models/availabilityModel.js";
import { catchMsg, callModel } from "../lib/utils.js";
import { sendError, sendSuccess } from "../utils/resultFactory.js";

export async function addAvailability(req, res) {
	try {
		if (req.user.role !== "hairdresser") {
			return sendError(res, 403, "Only hairdressers can add availabilities");
		}

		const { availability_date } = req.body;
		const hairdresser_id = req.user.id;

		if (!availability_date) {
			return sendError(res, 400, "Missing availability_date");
		}

		const alreadyExists = await isAvailabilityExistById({
			hairdresser_id,
			availability_date,
		});
		if (alreadyExists) {
			return sendError(
				res,
				409,
				"Availability already exists for this date and hairdresser"
			);
		}

		await callModel(res, 73, insertAvailability, "availability", {
			hairdresser_id,
			availability_date,
		});

		return sendSuccess(
			res,
			{ hairdresser_id, availability_date },
			"Availability added successfully"
		);
	} catch (error) {
		return catchMsg(`availability addAvailability`, error, res);
	}
}

export async function modifyAvailability(req, res) {
	try {
		const availabilityId = req.params.id;
		const availabilityNewStatus = req.body.status;

		if (
			availabilityNewStatus !== "accepted" &&
			availabilityNewStatus !== "assigned" &&
			availabilityNewStatus !== "cancelled"
		) {
			return sendError(res, 400, "Invalid status");
		}

		if (!availabilityId || !availabilityNewStatus) {
			return sendError(res, 400, "Missing id or status");
		}

		if (req.user.role !== "hairdresser") {
			return sendError(res, 403, "Only hairdressers can modify availabilities");
		}

		const availability = await isAvailabilityExistById({ availabilityId });

		if (!availability) {
			return sendError(res, 404, "Availability not found");
		}

		if (availability.status !== "pending") {
			return sendError(
				res,
				409,
				"This availability cannot be updated as it is not pending"
			);
		}

		if (availability.hairdresser_id !== req.user.id) {
			return sendError(res, 403, "Not authorized to modify this availability");
		}

		await callModel(res, 74, updateAvailability, "availability", {
			id: availabilityId,
			status: availabilityNewStatus,
		});
		return sendSuccess(
			res,
			{ availabilityId, status: availabilityNewStatus },
			"Availability updated successfully"
		);
	} catch (error) {
		return catchMsg(`availability modifyAvailability`, error, res);
	}
}
