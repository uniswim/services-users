import config from "@config/*";
import * as Colors from "colors";
import { Migration } from "@dadoudidou/migration"
import server from "./server";

const StartApp = async () => {
    console.log("");
    console.log("");
    console.log("");

    console.log("Start Application".underline.green);
    console.log("");

    // -- configuration
    console.log(Colors.green("**** CONFIGURATION ENVIRONNEMENT ****"))
    console.log("\x1b[33m- port                 \x1b[0m : %s", config.server.port);
    console.log("\x1b[33m- database dialect     \x1b[0m : %s", config.bdd.dialect);
    console.log("\x1b[33m- database host        \x1b[0m : %s", config.bdd.host);
    console.log("\x1b[33m- database username    \x1b[0m : %s", config.bdd.username);
    console.log("\x1b[33m- database name        \x1b[0m : %s", config.bdd.database);

    console.log("");
    console.log(Colors.green("**** MIGRATE DATABASE ****"))
    /*var migration = Migration.getInstance();
    migration.setup({
        database: config.bdd,
        extension: "sql",
        logger: (msg) => console.log(msg),
        migrationFolder: "migrations"
    });
    migration.up()*/

    console.log("");
    console.log(Colors.green("**** START SERVER ****"))
    server();

    
}

StartApp();



