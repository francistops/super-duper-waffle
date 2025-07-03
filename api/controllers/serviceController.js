import {
	fetchServices,
	fetchServicesById,
	fetchServicesByAppointmentId,
	fetchServicesByHairdresserId,
	fetchNextServices,
	insertService,
	updateService,
	deleteService,
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

export async function getServiceById(req, res) {
	return "getServicesById niy";
	let result = UNKNOWN_ERROR;
	const id = req.body;
	//todo change if role is not client
	try {
		const services = await fetchServicesById(id);
		result = {
			message: "Success",
			errorCode: 0,
			services: services,
		};
	} catch (error) {
		catchMsg(`service getServicesById ${req.body}`);
	}

	res.formatView(result);
}

export async function getServiceByAppointmentId(req, res) {
	return "getServicesByAppointmentId niy";
	let result = UNKNOWN_ERROR;
	try {
		const services = await fetchServicesByAppointmentId();
		result = {
			message: "Success",
			errorCode: 0,
			services: services,
		};
	} catch (error) {
		catchMsg(`service getServicesByAppointmentId ${req.body}`);
	}

	res.formatView(result);
}

export async function addService(req, res) {
	return "addService nyi";
	let result = UNKNOWN_ERROR;
	const data = req.body;
	console.log(data);

	try {
		const service = await insertService(data);

		result = {
			message: "Success",
			errorCode: 0,
			service: service,
		};
	} catch (error) {
		catchMsg(`service addService ${req.body}`);
	}

	res.formatView(result);
}

export async function editService(req, res) {
	return "editService nyi";
	let result = UNKNOWN_ERROR;
	const data = req.body;
	console.log(data);

	try {
		const service = await updateService(data);

		result = {
			message: "Success",
			errorCode: 0,
			service: service,
		};
	} catch (error) {
		catchMsg(`service updateService ${req.body}`);
	}

	res.formatView(result);
}

export async function removeService(req, res) {
	return "removeService nyi";
	let result = UNKNOWN_ERROR;
	const data = req.body;
	console.log(data);

	try {
		const service = await deleteService(data);

		result = {
			message: "Success",
			errorCode: 0,
			service: service,
		};
	} catch (error) {
		catchMsg(`service removeService ${req.body}`);
	}

	res.formatView(result);
}
