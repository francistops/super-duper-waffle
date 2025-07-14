import {
	fetchAvailabilities,
	insertAvailability,
	updateAvailability,
	isAvailabilityExist
} from "../models/availabilityModel.js";
import { catchMsg, assertSameUserOrThrow, assertSameTokenOrThrow } from "../lib/utils.js";
import { isTokenExist } from "../models/tokenModel.js";


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

	try {
		const data = req.body;
		if (!data.hairdresser_id || !data.availability_date) {
			return res.status(400).formatView({
				message: "Missing hairdresser_id or availability_date",
				errorCode: 1,
			});
		}

		const userIdFromToken = req.user.id;
		assertSameUserOrThrow(data.hairdresser_id, userIdFromToken);

		
		const isTokenResult = await isTokenExist(userIdFromToken);

		if (!isTokenResult.status) {
			return res.status(404).formatView({
			message: "No active session found",
			errorCode: 404,
			});
		}

		const tokenFromRequest = req.selectedToken.token;
		const tokenFromDb = isTokenResult.token.token;
		assertSameTokenOrThrow(tokenFromRequest, tokenFromDb);

		const alreadyExists = await isAvailabilityExist(data.hairdresser_id, data.availability_date);
		if (alreadyExists) {
			return res.status(409).formatView({
				message: "Availability already exists for this date and hairdresser",
				errorCode: 409,
			});
		}

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

export async function modifyAvailability(req, res) {
	let result = UNKNOWN_ERROR;

	try {
		const userIdFromToken = req.user.id;
		const userIdFromParams = req.params.id;
		
		assertSameUserOrThrow(userIdFromParams, userIdFromToken);
		
		const isTokenResult = await isTokenExist(userIdFromToken);

		if (!isTokenResult.status) {
		  return res.status(404).formatView({
			message: "No active session found",
			errorCode: 404,
		  });
		}
			const availability = await updateAvailability({ id, status });

			result = {
				message: "Success",
				errorCode: 0,
				availability: availability,
			};
			result = {
				message: "Missing id or status",
				errorCode: 1,
			};
	} catch (error) {
		catchMsg(`availability updateAvailability id=${id}`, error, res, result);
	}
	res.formatView(result);
}
