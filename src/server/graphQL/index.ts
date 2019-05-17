import { compileSchema } from "@dadoudidou/typegql";
import AuthSchemaRoot from "./SchemaRoots/AuthSchemaRoot";
import database from "@database/*";
import ClientSchemaRoot from "./SchemaRoots/ClientSchemaRoot";
import ApplicationSchemaRoot from "./SchemaRoots/ApplicationSchemaRoot";
import ServerSchemaRoot from "./SchemaRoots/ServerSchemaRoot";
import { Ability, RawRule } from "@casl/ability"
import Utilisateur from "./../../database/models/Utilisateur";

export type UserContextCache = {
    id: number
    token: string
    abilityRules: RawRule[]
}

export type UserContext = {
    id: number
    token: string
    entity?: Utilisateur
    ability: Ability
}

export type GraphQLContext = {
    models: typeof database.models
    repos: typeof database.repos
    user?: UserContext
}

// https://github.com/prismake/typegql

const finalSchema = compileSchema({
    roots: [
        AuthSchemaRoot,
        ClientSchemaRoot,
        ApplicationSchemaRoot,
        ServerSchemaRoot
    ]
});

export default () => finalSchema