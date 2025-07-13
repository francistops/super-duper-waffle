import { client } from '../config/db.js';

// Helper function to log request details
const logRequest = async (method, route, status, message, userAgent, errorMessage = '', stackTrace = '') => {
    const logData = {
        id: logId,
        timestamp: timestamp,
        level: status >= 400 ? 'ERROR' : 'INFO', // Set log level based on status code
        method: method,
        route: route,
        status: status,
        message: message,
        user_agent: userAgent,
        error_message: errorMessage,
        stack_trace: stackTrace,
    };

    const query = `
    INSERT INTO logs (id, timestamp, level, method, route, status, message, user_agent, error_message, stack_trace)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
    const params = [
        logData.id,
        logData.timestamp,
        logData.level,
        logData.method,
        logData.route,
        logData.status,
        logData.message,
        logData.user_agent,
        logData.error_message,
        logData.stack_trace
    ];

    try {
        await client.execute(query, params, { prepare: true });
    } catch (err) {
        console.error('Error writing to Cassandra log:', err);
    }
};

// Middleware function to log request details
const loggerMiddleware = async (req, res, next) => {
    const { method, originalUrl, headers } = req;
    const userAgent = headers['user-agent'];

    // Attach a custom property to capture the status code in the response
    res.on('finish', async () => {
        const { statusCode } = res;
        await logRequest(method, originalUrl, statusCode, 'Request processed successfully', userAgent);
    });

    next();
};

// Error logging middleware
const errorLoggerMiddleware = async (err, req, res, next) => {
    const { method, originalUrl, headers } = req;
    const userAgent = headers['user-agent'];

    // Log the error details to Cassandra
    await logRequest(method, originalUrl, 500, 'Internal Server Error', userAgent, err.message, err.stack);

    res.status(500).json({ message: 'Something went wrong!' });
};

export { loggerMiddleware, errorLoggerMiddleware };
