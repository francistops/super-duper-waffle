import {
	fetchFeedbacks,
	insertFeedback,
	isFeedbackExist,
} from "../models/feedbackModel.js";
import { catchMsg } from "../lib/utils.js";
import { makeError, makeSuccess } from "../utils/resultFactory.js";

export async function getFeedbacks(req, res) {
	let result = makeError();

	try {
		const feedbacks = await fetchFeedbacks();

		if (!feedbacks) {
			result = makeError({ feedbacks }, "No feedbacks found");
		} else {
			result = makeSuccess({ feedbacks }, "Feedbacks retrieved successfully");
		}
	} catch (error) {
		catchMsg(`feedback FetchFeedback`, error, res, result);
	}
	res.formatView(result);
}

export async function addFeedback(req, res) {
	let result = makeError();

	try {
		const { appointmentId, clientId, comment, rating } = req.body;

		if (!appointmentId || !clientId || !comment || !rating) {
			return makeError(
				{ appointmentId, clientId, comment, rating },
				"Champs manquants pour le feedback"
			);
		}

		const alreadyExists = await isFeedbackExist(appointmentId, clientId);
		if (alreadyExists) {
			return sendError(
				res,
				409,
				"Un feedback existe déjà pour ce rendez-vous."
			);
		}

		const feedback = await insertFeedback({
			appointmentId,
			clientId,
			comment,
			rating,
		});

		if (!feedback) {
			return makeError({ feedback }, "Erreur lors de l'insertion du feedback");
		} else {
			result = makeSuccess({ feedback }, "Feedback ajouté avec succès");
		}

		await modifyAppointment(appointmentId, "feedback");

		result = sendSuccess(res, { feedback }, "Feedback ajouté avec succès");
	} catch (error) {
		catchMsg(`feedback addFeedback`, error, res, result);
	}
	return res.formatView(result);
}
