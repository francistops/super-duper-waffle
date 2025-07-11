import cassandra from 'cassandra-driver';

const client = new cassandra.Client({
	contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || 'cassandra'],
	localDataCenter: 'datacenter1',
	keyspace: 'logsystem'
});

await client.connect();

export async function writeLog(log) {
	const query = `
		INSERT INTO logs (id, timestamp, level, description, module, file, line)
			VALUES(uuid(), toTimestamp(now)), ?, ?, ?, ?, ?)
	`;

	const params = [log.level, log.description, log.module, log.file, log.line];

	await client.execute(query, params, { prepare: true});
}

export async function fetchAllLogs() {
	const query = `SELECT * FROM logs`;
	const result = await client.execute(query);
	return result.rows;
}
