INSERT INTO logsystem.logs (id, timestamp, level, description)
VALUES (uuid(), toTimestamp(now()), 'INFO', 'Cassandra logging system initialized.');

INSERT INTO logsystem.logs (id, timestamp, level, description, module)
VALUES (uuid(), toTimestamp(now()), 'DEBUG', 'Gathering data...', 'Authorization system');

INSERT INTO logsystem.logs (id, timestamp, level, description, module)
VALUES (uuid(), toTimestamp(now()), 'ERROR', 'Unable to read file...', 'Authorization system');

INSERT INTO logsystem.logs (id, timestamp, level, description, module, file, line)
VALUES (uuid(), toTimestamp(now()), 'DEBUG', 'Error found in system', 'Main I/O', 'system.js', 33);
