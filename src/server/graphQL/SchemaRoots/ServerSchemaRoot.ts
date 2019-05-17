import { SchemaRoot, Query, Context, Mutation } from "@dadoudidou/typegql"
import Utilisateur from "../Types/Objects/Utilisateur";
import { GraphQLContext } from "@graphQL/*";
import * as jwt from "jsonwebtoken"
import config from "@config/*";
import ServerStatus from "../Types/Objects/ServerStatus";
import { toObjectType } from "../Helpers/ToObjectType";

@SchemaRoot()
export default class ServerSchemaRoot {
    
    @Query()
    status(): ServerStatus {
        return toObjectType(
            ServerStatus,
            {
                message: "live"
            }
        );
    }

}