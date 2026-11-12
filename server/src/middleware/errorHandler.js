export const notFound = (req, res, next) => {
    res.status(404);
    next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
    let status = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if(err.code === 11000) {
        status = 400;
        const field = Object.keys(err.keyValue || {})[0] || "value";
        message = `${field} already exists`;
    }

    if(err.name === "ValidationError") {
        status = 400;
        message = Object.values(err.errors).map((e) => e.message).join(", ");
    }

    if (err.name === "CastError") {
        status = 400;
        message = `Invalid ${err.path}`;
    }

    res.status(status).json({
        message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};