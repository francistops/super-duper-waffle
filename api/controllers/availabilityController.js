import {
	insertAvailability,
	updateAvailability,
	isAvailabilityExist
} from "../models/availabilityModel.js";
import { catchMsg, callModel, assertSameUserOrThrow, assertSameTokenOrThrow } from "../lib/utils.js";
import { isTokenExist } from "../models/tokenModel.js";
import { sendError } from "../utils/resultFactory.js";

export async function addAvailability(req, res) {
	const { hairdresser_id, availability_date } = req.body;

	if (!hairdresser_id || !availability_date) {
		return sendError(res, 400, "Missing hairdresser_id or availability_date", 1);
	}

	const userIdFromToken = req.user.id;
	assertSameUserOrThrow(hairdresser_id, userIdFromToken);

	const isTokenResult = await isTokenExist(userIdFromToken);
	if (!isTokenResult.status) {
		return sendError(res, 404, "No active session found");
	}

	const tokenFromRequest = req.selectedToken.token;
	const tokenFromDb = isTokenResult.token.token;
	assertSameTokenOrThrow(tokenFromRequest, tokenFromDb);

	const alreadyExists = await isAvailabilityExist({ hairdresser_id, availability_date });
	if (alreadyExists) {
		return sendError(res, 409, "Availability already exists for this date and hairdresser");
	}

	await callModel(
		res,
		73,
		insertAvailability,
		"availability",
		{ hairdresser_id, availability_date }
	);
}

export async function modifyAvailability(req, res) {
	const availabilityId = req.params.id;
	const availabilityNewStatus = req.body.status;
	console.log("User:", req.user);

	console.log("modifyAvailability called with id:", availabilityId, "and status:", availabilityNewStatus);

	if (!availabilityId || !availabilityNewStatus) {
		return sendError(res, 400, "Missing id or status", 1);
	}

	const userRole = req.user.role;
	console.log("User role:", userRole);

	if (userRole !== "client") {
		return sendError(res, 403, "Only clients can modify availabilities");
	}

	const availability = await isAvailabilityExist({ availabilityId });

	console.log("Availability found:", availability);

	if (!availability) {
		return sendError(res, 404, "Availability not found");
	}

	if (availability.status !== "pending") {
		return sendError(res, 409, "This availability cannot be updated as it is not pending");
	}

	await callModel(
		res,
		74,
		updateAvailability,
		"availability",
		{ id: availabilityId, status: availabilityNewStatus }
	);
}
