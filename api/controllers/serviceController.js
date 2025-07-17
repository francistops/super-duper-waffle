import {
	fetchServices,
	insertService,
	isServiceExist,
} from "../models/serviceModel.js";
import { sendError, sendSuccess } from "../utils/resultFactory.js";
import { catchMsg } from "../lib/utils.js";

export async function getServices(req, res) {
	try {
		const services = await fetchServices();

		if (!services || services.length === 0) {
			return sendError(res, 404, "No services found");
		} else {
			return sendSuccess(res, { services }, "Services retrieved successfully");
		}
	} catch (error) {
		return catchMsg(`service getServices`, error, res);
	}
}

export async function addServices(req, res) {
	try {
		const { name, price } = req.body;
		const duration = 60;

		if (!name || !price) {
			return sendError(res, 400, "Missing fields for the service");
		}
		const alreadyExists = await isServiceExist(name);
		if (alreadyExists) {
			return sendError(res, 409, "Ce service existe déjà.");
		}

		const service = await insertService({ name, price }, duration);

		if (!service) {
			return sendError(res, 400, "Erreur lors de l'ajout du service");
		} else {
			return sendSuccess(res, { id: service.id }, "Service added successfully");
		}
	} catch (error) {
		return catchMsg(`service addServices`, error, res);
	}
}
