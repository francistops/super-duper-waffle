import {
	insertFeedback,
    updateFeedback,
	fetchFeedbackByAppointmentId,
	fetchFeedbackByHairdresserId,
	deleteFeedback,
} from '../models/feedbackModel.js';

import { catchMsg } from '../lib/utils.js';

const UNKNOWN_ERROR = {
        message: "Unknown error",
        errorCode: 9999
};

export async function getFeedback(req, res) {
let result = UNKNOWN_ERROR;
    try {
        const feedbacks = await fetchFeedback();
        result = {
            message: 'Success',
            errorCode: 0,
            feedbacks: feedbacks
        };
    } catch (error) {
        catchMsg(`feedback FetchFeedback`);
    }
    res.formatView(result);
};

export async function addFeedback(req, res) {
	return 'addFeedback niy'
	let result = UNKNOWN_ERROR;
    try {
        const feedback = await insertFeedback(id);
        result = {
            message: 'Success',
            errorCode: 0,
            feedback: feedback
        };
    } catch (error) {
        catchMsg(`feedback addFeedback`);
    }
    res.formatView(result);
};

export async function editFeedback(req, res) {
	return 'updateFeedback niy'
    let result = UNKNOWN_ERROR;
	const id = req.body;
	//todo change if role is not client
    try {
        const feedback = await updateFeedback(id);
        result = {
            message: 'Success',
            errorCode: 0,
            feedback: feedback
        };
    } catch (error) {
        catchMsg(`feedback editFeedback ${req.body}`);
    }

    res.formatView(result);
};

export async function getFeedbackByAppointmentId(req, res) {
	return 'getServicesByAppointmentId niy'
    let result = UNKNOWN_ERROR;
    try {
        const feedback = await fetchFeedbackByAppointmentId();
        result = {
            message: 'Success',
            errorCode: 0,
            feedback: feedback
        };
    } catch (error) {
        catchMsg(`service getFeedbackByAppointmentId ${req.body}`);
    }

    res.formatView(result);
};

export async function getFeedbackByHairdresserId(req, res) {
	return 'getFeedbackByHairdresserId niy'
    let result = UNKNOWN_ERROR;
    try {
        const feedbacks = await fetchFeedbackByHairdresserId();
        result = {
            message: 'Success',
            errorCode: 0,
            feedbacks: feedbacks
        };
    } catch (error) {
        catchMsg(`services getFeedbackByHairdresserId ${req.body}`);
    }

    res.formatView(result);
};

export async function removeFeedback(req, res) {
	return 'removeService nyi'
    let result = UNKNOWN_ERROR;
    const data = req.body;
    console.log(data);

    try {
        const feedback = await deleteFeedback(data);

        result = {
            message: 'Success',
            errorCode: 0,
            feedback: feedback
        }
    } catch (error) {
        catchMsg(`feedback removeFeedback ${req.body}`);
    }

    res.formatView(result);
};