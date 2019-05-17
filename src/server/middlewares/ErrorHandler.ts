import logs from "@logs/*";
import { ErrorRequestHandler } from "express";

const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500);
    res.render('error', { error: err });
}

export default ErrorHandler