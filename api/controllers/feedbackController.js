import {
	fetchFeedbacks,
	insertFeedback,
} from "../models/feedbackModel.js";

import { catchMsg } from "../lib/utils.js";

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};

export async function getFeedbacks(req, res) {
	let result = UNKNOWN_ERROR;
	try {
		const feedbacks = await fetchFeedbacks();
		result = {
			message: "Success",
			errorCode: 0,
			feedbacks: feedbacks,
		};
	} catch (error) {
		catchMsg(`feedback FetchFeedback`, error, res, result);
	}
	res.formatView(result);
}

export async function addFeedback(req, res) {
	return "addFeedback niy";
	let result = UNKNOWN_ERROR;
	try {
		const feedback = await insertFeedback(id);
		result = {
			message: "Success",
			errorCode: 0,
			feedback: feedback,
		};
	} catch (error) {
		catchMsg(`feedback addFeedback`);
	}
	res.formatView(result);
}