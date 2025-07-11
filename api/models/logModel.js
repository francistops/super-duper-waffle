import cassandra from 'cassandra-driver';

const client = new cassandra.Client({
    contactPoints: [Process.env.CASSANDRA_CONTACT_POINTS || 'cassandra'],
    localDataCenter: 'datacenter1',
    keyspace: 'logsystem'
});

await client.connect();

export async function writelog(log) {
    const query = `
    insert into (id, times)
        Values(uuid(), toTimeststamps(now()), ?, ?, ?, ?, ?)
    `;

    const params = [
        log.level log.desc log.module log.file log.line
    ]

    await client.execute(query, params, { prepare: true });
}
