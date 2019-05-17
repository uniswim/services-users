import { Migration, MigrationConfig } from "@dadoudidou/migration"
import config from "../config";

export default () => {
    var migration = new Migration();

    migration.setup({
        extension: "sql",
        migrationFolder: "../migrations",
        database:{
            host: config.bdd.host,
            username: config.bdd.username,
            password: config.bdd.password,
            database: config.bdd.database,
        },
        logger: (msg) => console.log(msg)
    });

    //migrate
    migration.up();
}