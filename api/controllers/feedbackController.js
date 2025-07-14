import {
	fetchFeedbacks,
	insertFeedback,
	isFeedbackExist
} from "../models/feedbackModel.js";
import { isTokenExist } from "../models/tokenModel.js";
import { catchMsg, assertSameUserOrThrow } from "../lib/utils.js";

const UNKNOWN_ERROR = {
	message: "Unknown error",
	errorCode: 9999,
};

export async function getFeedbacks(req, res) {
	let result = UNKNOWN_ERROR;
	try {
		const feedbacks = await fetchFeedbacks();

		if (!feedbacks) {
			return res.status(404).formatView({
				message: "No feedbacks found",
				errorCode: 404,
			});
		}

		if (feedbacks.length === 0) {
			return res.status(204).formatView({
				message: "No feedbacks available",
				errorCode: 204,
			});
		}
		
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
	let result = UNKNOWN_ERROR;
	
	try {
		const { appointmentId, clientId, comment, rating } = req.body;

		if (!appointmentId || !clientId || !comment || !rating) {
			return res.status(400).formatView({
				message: "Champs manquants pour le feedback",
				errorCode: 400,
			});
		}

		const feedback = await insertFeedback({ appointmentId, clientId, comment, rating });

		if (!feedback) {
			return res.status(500).formatView({
				message: "Erreur lors de l'insertion du feedback",
				errorCode: 500,
			});
		}
		result = {
			message: "Success",
			errorCode: 0,
			feedback: feedback,
		};
	} catch (error) {
		catchMsg(`feedback addFeedback`, error, res, result);
	}
	res.formatView(result);
}