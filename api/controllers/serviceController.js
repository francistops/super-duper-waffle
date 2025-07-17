import { makeError, makeSuccess } from "../utils/resultFactory.js";
import { catchMsg } from "../lib/utils.js";

import { fetchServices } from "../models/serviceModel.js"

export async function getServices(req, res) {
    let result = makeError();
    console.error("getServices called");
    try {
        console.error("Fetching services...");
        const services = await fetchServices();
        console.error("Services fetched successfully:", services);

        if (!services) {
            result = makeError({ services }, "No services found");
        } else {
            result = makeSuccess({ services }, "Services retrieved successfully");
        }
    } catch (error) {
        catchMsg(`service getServices`, error, res, result);
    }
    res.formatView(result);
}