import { connectDatabases, client } from '../config/db.js';

connectDatabases

export async function writeLog(logData) {
	// console.log('in logModel logdata: ', logData);
	const query = `
    INSERT INTO logsystem.logs (
                        id, 
                        timestamp,
                        level,
                        method, 
                        route, 
                        status, 
                        message, 
                        user_agent,
                        error_message,
                        stack_trace
                    )
    VALUES (uuid(), toTimestamp(now()), ?, ?, ?, ?, ?, ?, ?, ?);
  `;
	const params = [
		logData.level,
		logData.method,
		logData.route,
		logData.status,
		logData.message,
		logData.user_agent,
		logData.error_message,
		logData.stack_trace
	];

	await client.execute(query, params, { prepare: true});
}

export async function fetchLogs() {
	const query = `SELECT * FROM logs`;
	const result = await client.execute(query);
	return result.rows;
}
