import { makeError, makeSuccess } from '../utils/resultFactory.js';
import { writeLog, fetchLogs } from '../models/logModel.js';

export async function sendLog(req, res) {
	let result = makeError();
	const log = req.body;

	try {
		await writeLog(log);
		result = makeSuccess({ status: "success" });
	} catch (error) {
		// sauf ici - LOG PAS ICI
		res.status(401);
		result = makeError(`Error writing log: ${log} with error: ${error}`, 1004);
	}

	res.formatView(result);
}

export async function getLogs(req, res) {
	let result = makeError();
	try {
		const logs = await fetchLogs();
		result = makeSuccess({ logs: logs });
	} catch (error) {
		res.status(400);
		result = makeError(`Error retrieving logs ${error}`, 1003);
	}
	res.formatView(result);
}
