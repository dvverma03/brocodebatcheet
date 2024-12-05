class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message); // Call the parent class (Error) constructor with the message
        this.statusCode = statusCode; // HTTP status code
        this.data = null; // Placeholder for any additional data
        this.success = false; // API response success status
        this.errors = errors; // Additional error details

        if (stack) {
            this.stack = stack; // Use provided stack trace if available
        } else {
            Error.captureStackTrace(this, this.constructor); // Capture stack trace
        }
    }
}

// Export using CommonJS syntax for compatibility with Node.js
module.exports = { ApiError };
