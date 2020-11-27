/**
 * Common Api Errors
 */
export declare class ApiError {
    static notFound(message?: string, status?: number): HttpError;
    static serverError(message?: string, status?: number): HttpError;
    static accessError(message?: string, status?: number): HttpError;
}
export declare class HttpError extends Error {
    private status;
    constructor(msg: string, status?: number);
}
