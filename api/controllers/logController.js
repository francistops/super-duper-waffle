import { sendError, sendSuccess } from "../utils/resultFactory.js";
import { writeLog, fetchLogs } from "../models/logModel.js";

export async function sendLog(req, res) {
	const log = req.body;

	try {
		await writeLog(log);
		return sendSuccess(res, { status: "success" });
	} catch (error) {
		// sauf ici - LOG PAS ICI
		return sendError(
			res,
			401,
			`Error writing log: ${JSON.stringify(log)} with error: ${error}`,
			1004
		);
	}
}

export async function getLogs(req, res) {
	try {
		const logs = await fetchLogs();
		return sendSuccess(res, { logs });
	} catch (error) {
		return sendError(
			res,
			400,
			`Error retrieving logs: ${error.message || error}`,
			1003
		);
	}
}
