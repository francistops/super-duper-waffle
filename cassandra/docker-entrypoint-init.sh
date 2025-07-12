#!/bin/sh

# echo "Starting Cassandra in background..."
# docker-entrypoint.sh cassandra -R &

# # Wait for Cassandra to become available
# echo "!!! --- Waiting for Cassandra to be ready... ---!!!"
# until cqlsh -e 'DESCRIBE KEYSPACES;' > /dev/null 2>&1; do
#   echo "!!! --- in loop --- !!!"
#   sleep 10
# done

# echo "Creating schema..."
# cqlsh -f /init-schema.cql

# echo "Waiting for schema agreement..."
# sleep 10  # Wait to ensure schema propagation

# echo "Inserting data..."
# cqlsh -f /init-data.cql

# wait
# echo "!!! --- eof --- !!!"

# echo "Starting Cassandra in background..."
# docker-entrypoint.sh cassandra -R &

# # Wait for Cassandra to become available
# echo "!!! --- Waiting for Cassandra to be ready... ---!!!"
# RETRIES=30
# until cqlsh -e 'DESCRIBE KEYSPACES;' > /dev/null 2>&1; do
#   echo "!!! --- Cassandra not ready, waiting... --- !!!"
#   RETRIES=$((RETRIES-1))
#   if [ $RETRIES -le 0 ]; then
#     echo "Cassandra did not become ready in time. Exiting."
#     exit 1
#   fi
#   sleep 10
# done

# echo "Creating schema..."
# cqlsh -f /init-schema.cql

# echo "Waiting for schema agreement..."
# sleep 10  # Wait to ensure schema propagation

# echo "Inserting data..."
# cqlsh -f /init-data.cql

# wait
# echo "!!! --- eof --- !!!"


echo "Starting Cassandra in background..."
docker-entrypoint.sh cassandra -R &

CASS_PID=$!

# Wait for Cassandra to become available
echo "!!! --- Waiting for Cassandra to be ready... ---!!!"
RETRIES=60
until cqlsh -e 'DESCRIBE KEYSPACES;' > /dev/null 2>&1; do
  echo "!!! --- Cassandra not ready, waiting... --- !!!"
  RETRIES=$((RETRIES-1))
  if [ $RETRIES -le 0 ]; then
    echo "Cassandra did not become ready in time. Exiting."
    kill $CASS_PID
    exit 1
  fi
  sleep 10
done

echo "Creating schema..."
cqlsh -f /init-schema.cql

echo "Waiting for schema agreement..."
sleep 10  # Wait to ensure schema propagation

echo "Inserting data..."
cqlsh -f /init-data.cql

echo "!!! --- eof --- !!!"

wait