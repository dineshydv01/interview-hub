export const notFound = (req, res, next) => {
    res.status(404);
    next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
    let status = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if(err.code === 11000) {
        status = 400;
        message = "Email already registered";
    }

    if(err.name === "ValidationError") {
        status = 400;
        message = Object.values(err.errors).map((e) => e.message).join(", ");
    }

    res.status(status).json({
        message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};