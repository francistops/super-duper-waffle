import { client } from '../config/db.js';

// Helper function to log request details
const logRequest = async (method, route, status, message, userAgent, errorMessage = '', stackTrace = '') => {
    const logData = {
        level: status >= 400 ? 'ERROR' : 'INFO', // Set log level based on status code
        method: method,
        route: route,
        status: status,
        message: message,
        user_agent: userAgent,
        error_message: errorMessage,
        stack_trace: stackTrace,
    };
    
    // console.log(`=== log data debug ===`);
    // console.log(logData)
    // console.log(`=== end ===`);

    const query = `
    INSERT INTO logsystem.logs (
                        id, 
                        timestamp,
                        level,
                        method, 
                        route, 
                        status, 
                        message, 
                        user_agent,
                        error_message,
                        stack_trace
                    )
    VALUES (uuid(), toTimestamp(now()), ?, ?, ?, ?, ?, ?, ?, ?);
  `;
    const params = [
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
    if (req.originalUrl == '/logs') {
        console.log('INFO: skipping logging... for ', req.originalUrl );
        return next();
    } 
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
    if (req.originalUrl == '/logs') {
        console.log('INFO: in error but skipping logging... for ', req.originalUrl);
        return next();
    } 

    const { method, originalUrl, headers } = req;
    const userAgent = headers['user-agent'];

    // Log the error details to Cassandra
    await logRequest(method, originalUrl, 500, 'Internal Server Error', userAgent, err.message, err.stack);
    res.status(500).json({ message: `Something went wrong! ${method}, ${originalUrl}, ${userAgent}, ${err.message}, ${err.stack}` });
};

export { loggerMiddleware, errorLoggerMiddleware };
