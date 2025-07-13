INSERT INTO logsystem.logs (id, timestamp, level, message)
VALUES (uuid(), toTimestamp(now()), 'INFO', 'Cassandra logging system initialized.');

INSERT INTO logsystem.logs (id, timestamp, level, message, error_message)
VALUES (uuid(), toTimestamp(now()), 'DEBUG', 'Gathering data...', 'Authorization system');

INSERT INTO logsystem.logs (id, timestamp, level, message, error_message)
VALUES (uuid(), toTimestamp(now()), 'ERROR', 'Unable to read file...', 'Authorization system');

INSERT INTO logsystem.logs (id, timestamp, level, message, error_message, stack_trace)
VALUES (uuid(), toTimestamp(now()), 'DEBUG', 'Error found in system', 'Main I/O', 'system.js 33');

INSERT INTO logsystem.logs ( id, timestamp, level, method, route, status, message, user_agent, error_message, stack_trace )
VALUES (uuid(), toTimestamp(now()), 'DEBUG', 'GET', 'manual-entrie', 200, 'manual entrie', 'bogus user-agent', 'no error', 'stack trace empty');