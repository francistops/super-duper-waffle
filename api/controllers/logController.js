import {
	writeLog,
	fetchAllLogs
} from '../models/logModel.js';

export async function createLog(req, res) {
	const { log } = req.body;
	let result = UNKNOWN_ERROR;

	try {
		await writeLog(log);
		result = {
			message: 'Success',
			errorCode: 0
		};
	} catch (error) {
		// sauf ici - LOG PAS ICI
		res.status(401);
		result.message = `Erreur ${error}`;
		result.errorCode = 9055;
	}

	res.formatView(result);
}