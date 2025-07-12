#!/bin/sh

echo "Starting Cassandra in background..."
docker-entrypoint.sh cassandra -R &

# Wait for Cassandra to become available
echo "!!! --- Waiting for Cassandra to be ready... ---!!!"
until cqlsh -e 'DESCRIBE KEYSPACES;' > /dev/null 2>&1; do
  echo "!!! --- in loop --- !!!"
  sleep 60
done

echo "Creating schema..."
cqlsh -f /init-schema.cql

echo "Waiting for schema agreement..."
sleep 60  # Wait to ensure schema propagation

echo "Inserting data..."
cqlsh -f /init-data.cql

waitq
echo "!!! --- eof --- !!!"
