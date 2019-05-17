import logs from "@logs/*";
import { ErrorRequestHandler } from "express";

const ClientErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
}

export default ClientErrorHandler;