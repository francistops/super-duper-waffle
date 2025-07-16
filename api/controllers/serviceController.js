// import { fetchServices } from "../models/serviceModel.js";
// import { catchMsg } from "../lib/utils.js";

// export async function getServices(req, res) {
// 	let result = makeError();

// 	try {
// 		const services = await fetchServices();

// 		if (!services) {
// 			result = makeError({ services }, "No services found");
// 		} else {
// 			result = makeSuccess({ services }, "Services retrieved successfully");
// 		}
// 	} catch (error) {
// 		catchMsg(`service getServices`, error, res, result);
// 	}
// 	res.formatView(result);
// }
