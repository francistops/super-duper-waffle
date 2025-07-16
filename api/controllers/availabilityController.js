import {
	insertAvailability,
	updateAvailability,
	isAvailabilityExist,
} from "../models/availabilityModel.js";
import { catchMsg, callModel } from "../lib/utils.js";
import { makeError, sendError } from "../utils/resultFactory.js";

export async function addAvailability(req, res) {
	let result = makeError();

	try {
		if (req.user.role !== "hairdresser") {
			return sendError(res, 403, "Only hairdressers can add availabilities");
		}

		const { hairdresser_id, availability_date } = req.body;

		if (!hairdresser_id || !availability_date) {
			return sendError(
				res,
				400,
				"Missing hairdresser_id or availability_date",
				1
			);
		}

		const alreadyExists = await isAvailabilityExist({
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
	} catch (error) {
		catchMsg(`availability addAvailability ${req.body}`, error, res, result);
	}
	res.formatView(result);
}

export async function modifyAvailability(req, res) {
	let result = makeError();
	console.error(
		"modifyAvailability called with params: ",
		req.params,
		req.body
	);

	try {
		const availabilityId = req.params.id;
		const availabilityNewStatus = req.body.status;

		if (
			availabilityNewStatus !== "accepted" &&
			availabilityNewStatus !== "assigned" &&
			availabilityNewStatus !== "cancelled"
		) {
			return sendError(res, 400, "Invalid status", 1);
		}

		if (!availabilityId || !availabilityNewStatus) {
			return sendError(res, 400, "Missing id or status", 1);
		}

		console.error(
			"modifyAvailability called with: ",
			availabilityId,
			availabilityNewStatus
		);
		console.error("User role: ", req.user.role);
		if (req.user.role !== "hairdresser") {
			return sendError(res, 403, "Only hairdressers can modify availabilities");
		}

		const availability = await isAvailabilityExist({ availabilityId });
		console.error("Availability found: ", availability);
		console.error("Availability status: ", availability.status);

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
	} catch (error) {
		catchMsg(
			`availability modifyAvailability ${req.params}`,
			error,
			res,
			result
		);
	}
	res.formatView(result);
}
