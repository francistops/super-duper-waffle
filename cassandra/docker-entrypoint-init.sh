#!/bin/sh

echo "Starting Cassandra in background..."
docker-entrypoint.sh cassandra -R &

# Wait for Cassandra to become available
echo "Waiting for Cassandra to be ready..."
until cqlsh -e 'DESCRIBE KEYSPACES;' > /dev/null 2>&1; do
  sleep 2
done

echo "Creating schema..."
cqlsh -f /init-schema.cql

echo "Waiting for schema agreement..."
sleep 5  # Wait to ensure schema propagation

echo "Inserting data..."
cqlsh -f /init-data.cql

wait
