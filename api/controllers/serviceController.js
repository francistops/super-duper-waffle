import { fetchServices } from "../models/serviceModel.js";

export async function getServices(req, res) {
	let result = makeError();
	try {
		const services = await fetchServices();
		console.error("Services fetched:", services);
		if (!services || services.length === 0) {
			console.error("No services found");
			result = makeError({ services }, "No services found");
		} else {
			result = makeSuccess({ services }, "Services retrieved successfully");
		}
	} catch (error) {
		catchMsg(`service getServices`, error, res, result);
	}
	res.formatView(result);
}
