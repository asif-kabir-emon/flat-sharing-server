import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ZodError) {
        const message = err.errors.map((error) => error.message).join(" ");
        const errorDetails = err.errors.map((error) => ({
            field: error.path[1],
            message: error.message,
        }));

        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: message || "Zod validation error.",
            errorDetails: {
                issues: errorDetails,
            },
        });
        return;
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Something went wrong",
        errorDetails: err,
    });
};

export default globalErrorHandler;
