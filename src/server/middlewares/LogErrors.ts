import logs from "@logs/*";
import { ErrorRequestHandler } from "express";

const LogError: ErrorRequestHandler = (err, req, res, next) => {
    logs.logExpress.error(err.stack);
    next(err);
}

export default LogError