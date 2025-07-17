import {
	fetchFeedbacks,
	insertFeedback,
	isFeedbackExist,
} from "../models/feedbackModel.js";
import { catchMsg } from "../lib/utils.js";
import { sendError, sendSuccess } from "../utils/resultFactory.js";

export async function getFeedbacks(req, res) {
	try {
		const feedbacks = await fetchFeedbacks();

		if (!feedbacks || feedbacks.length === 0) {
			return sendError(res, 404, "No feedbacks found");
		} else {
			return sendSuccess(
				res,
				{ feedbacks },
				"Feedbacks retrieved successfully"
			);
		}
	} catch (error) {
		return catchMsg(`feedback FetchFeedback`, error, res);
	}
}

export async function addFeedback(req, res) {
	try {
		const { appointmentId, clientId, comment, rating } = req.body;

		if (!appointmentId || !clientId || !comment || !rating) {
			return sendError(res, 400, "Champs manquants pour le feedback");
		}

		const alreadyExists = await isFeedbackExist(appointmentId);
		if (alreadyExists) {
			return sendError(
				res,
				409,
				"Un feedback existe déjà pour ce rendez-vous."
			);
		}
		if (rating < 1 || rating > 5) {
			return sendError(res, 400, "Rating must be between 1 and 5");
		}
		if (comment.length < 10 || comment.length > 500) {
			return sendError(
				res,
				400,
				"Comment must be between 10 and 500 characters"
			);
		}
		if (typeof rating !== "number") {
			return sendError(res, 400, "Rating must be a number");
		}
		if (typeof comment !== "string") {
			return sendError(res, 400, "Comment must be a string");
		}

		const feedback = await insertFeedback({
			appointmentId,
			clientId,
			comment,
			rating,
		});

		if (!feedback) {
			return sendError(res, 500, "Erreur lors de l'insertion du feedback");
		} else {
			return sendSuccess(
				res,
				{ id: feedback.id },
				"Feedback added successfully",
				1
			);
		}
	} catch (error) {
		return catchMsg(`feedback addFeedback`, error, res);
	}
}
