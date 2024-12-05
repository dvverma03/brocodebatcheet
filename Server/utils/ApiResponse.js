class ApiResponse {
    constructor(statusCode, data = null, message = "Success") {
        this.statusCode = statusCode; // HTTP status code
        this.data = data; // Response data
        this.message = message; // Response message
        this.success = statusCode < 400; // Indicates success for status codes below 400
    }
}

// Export using CommonJS syntax for compatibility with Node.js
module.exports = { ApiResponse };
