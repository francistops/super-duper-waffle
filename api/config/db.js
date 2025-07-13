
const { Client } = require('pg');
const cassandra = require('cassandra-driver');

const pgClient = new Client({
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

const cassClient = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_HOST],
    localDataCenter: 'datacenter1',
    keyspace: process.env.CASSANDRA_KEYSPACE,
});

async function connectDatabases() {
    try {
        await pgClient.connect();
        console.log("PostgreSQL connected");
        await cassClient.connect();
        console.log("Cassandra connected");
    } catch (err) {
        console.error("Error connecting to databases", err);
    }
}

module.exports = { pgClient, cassClient, connectDatabases };
