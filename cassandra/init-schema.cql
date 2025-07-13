DROP KEYSPACE IF EXISTS logsystem;

CREATE KEYSPACE IF NOT EXISTS logsystem WITH REPLICATION = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};

CREATE TABLE IF NOT EXISTS logsystem.logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMP,
  level TEXT,
  method TEXT,
  route TEXT,
  status INT,
  message TEXT,
  user_agent TEXT,
  error_message TEXT,
  stack_trace TEXT
);
