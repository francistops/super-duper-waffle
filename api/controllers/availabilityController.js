import {
	fetchAvailabilities,
	insertAvailability,
	updateAvailability,
} from "../models/availabilityModel.js";

import { catchMsg } from "../lib/utils.js";

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};

export async function getAvailabilities(req, res) {
	let result = UNKNOWN_ERROR;
	try {
		const availabilities = await fetchAvailabilities();
		result = {
			message: "Success",
			errorCode: 0,
			availabilities: availabilities,
		};
	} catch (error) {
		catchMsg(`availability getAvailabilities`, error, res, result);
	}
	res.formatView(result);
}

export async function addAvailability(req, res) {
	let result = UNKNOWN_ERROR;
	const data = req.body;
	try {
		if (data) {
			const availability = await insertAvailability({
				hairdresser_id: data.hairdresser_id,
				availability_date: data.availability_date,
			});
			result = {
				message: "Success",
				errorCode: 0,
				id: availability.id,
				hairdresser_id: availability.hairdresser_id,
				availability_date: availability.availability_date,
				status: availability.status
			};
		} else {
			result = {
				message: "Failed to add availability",
				errorCode: 1,
			};
		}
	} catch (error) {
		catchMsg(`availability addAvailability ${req.body}`, error, res, result);
	}
	res.formatView(result);
}

export async function editAvailability(req, res) {
	let result = UNKNOWN_ERROR;
	const { id } = req.params;
	const { status } = req.body;

	try {
		if (id && status) {
			const availability = await updateAvailability({ id, status });

			result = {
				message: "Success",
				errorCode: 0,
				availability: availability,
			};
		} else {
			result = {
				message: "Missing id or status",
				errorCode: 1,
			};
		}
	} catch (error) {
		catchMsg(`availability updateAvailability id=${id}`, error, res, result);
	}
	res.formatView(result);
}
