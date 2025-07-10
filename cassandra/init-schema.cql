DROP KEYSPACE IF EXISTS logsystem;

CREATE KEYSPACE IF NOT EXISTS logsystem WITH REPLICATION = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};

CREATE TABLE IF NOT EXISTS logsystem.logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMP,
  level TEXT,
  description TEXT,
  module TEXT,
  file TEXT,
  line INT
);
