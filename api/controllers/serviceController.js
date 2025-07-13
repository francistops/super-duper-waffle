import {
	fetchServices,
} from "../models/serviceModel.js";

import { catchMsg } from "../lib/utils.js";

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};

export async function getServices(req, res) {
	let result = UNKNOWN_ERROR;
	try {
		const services = await fetchServices();
		result = {
			message: "Success",
			errorCode: 0,
			services: services,
		};
	} catch (error) {
		catchMsg(`service getServices`, error, res, result);
	}
	res.formatView(result);
}