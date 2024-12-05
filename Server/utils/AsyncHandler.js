const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Ensure the function always returns a Promise, even if requestHandler is not async
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

module.exports = { asyncHandler };
