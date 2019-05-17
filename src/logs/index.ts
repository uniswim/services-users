import { LoggerManager, LoggerTransports } from "@uniswim/lib-services-utils"

export default {
    logDatabase: LoggerManager.createLogger("bdd"),
    logExpress: LoggerManager.createLogger("server:express")
        .add(LoggerTransports.consoleTransport({ handleExceptions: true })),
    logGraphQl: LoggerManager.createLogger("server:graphQL")
};