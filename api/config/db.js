
import { Pool } from 'pg';
import cassandra from 'cassandra-driver';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


const client = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || 'cassandra'],
    localDataCenter: 'datacenter1',
    keyspace: 'logsystem'
});

async function connectDatabases() {
    try {
        await pool.connect();
        console.log("PostgreSQL connected");
        await client.connect();
        console.log("Cassandra connected");
    } catch (error) {
        console.error("Error connecting to databases", error);
    }
}

export { pool, client, connectDatabases };
