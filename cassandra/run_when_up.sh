#! /bin/sh

# chmod +x pathtofile
#docker-compose exec cassandra cqlsh -f /init-schema.cql && docker-compose exec cassandra cqlsh -f /init-data.cql

docker-compose exec cassandra cqlsh -f /extra-data.cql

# you migth need to restard node-api after that
