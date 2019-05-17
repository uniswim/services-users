import "reflect-metadata";

import serverApp from "./app";
import logs from "@logs/*";

export default async () => {
    return serverApp()
    .then(async (server) => {
    })
    .catch((err) => {
        console.error(err);
        process.exit(err.message);
    })
}