import { NextFunction, Request, Response } from "express";

export const appErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    console.error(err);

    if (err.statusCode) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
        return;
    }

    if (err.name === "ValidationError") {
        res.status(400).json({
            success: false,
            message: err.message
        });
        return;
    }

    next(err);
}

export const genericErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}