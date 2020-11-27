"use strict";
/**
 * Common Api Errors
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError {
    static notFound(message, status) {
        return new HttpError(message || 'Not Found', status || 404);
    }
    static serverError(message, status) {
        return new HttpError(message || 'Server Error', status || 500);
    }
    static accessError(message, status) {
        return new HttpError(message || 'Access Denied', status || 401);
    }
}
exports.ApiError = ApiError;
class HttpError extends Error {
    constructor(msg, status) {
        super(msg);
        this.status = status || 500;
    }
}
exports.HttpError = HttpError;
