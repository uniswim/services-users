import { SchemaRoot, Query, Context, Mutation, Arg, ObjectType, Field } from "@dadoudidou/typegql"
import Utilisateur from "../Types/Objects/Utilisateur";
import { GraphQLContext } from "@graphQL/*";
import * as jwt from "jsonwebtoken"
import config from "@config/*";
import errors from "@errors/*";
import { AuthenticationError } from "apollo-server-core";
import { GraphQLString, GraphQLBoolean } from "graphql";
import { CheckCryptText, CryptText } from "./../../../utils/Crypt";

import * as bcrypt from "bcryptjs"
import { AuthenticatedHook, OwnerHook } from "../Hooks/index";
import { GQLScalarJSON } from "../Types/Scalars/JSON";
import { toObjectType } from "../Helpers/ToObjectType";
import { Linq } from "@utils/*";


@SchemaRoot()
export default class AuthSchemaRoot {
    
    @Mutation({
        description: "Authentifie un utilisateur et retourne un token si l'authentification est réussie",
        type: GraphQLString
    })
    async createCredential(
        email: string, 
        password: string, 
        @Arg({ isNullable:true, description: "Nombre de secondes après lequel le token expire. [1 jour par défaut]" })expiresIn: number, 
        @Context ctx: GraphQLContext): Promise<string> {

        let _user = await ctx.repos.utilisateur.CheckUtitlisateur(email, password);
        if(!_user){
            throw new AuthenticationError("Email ou mot de passe incorrect.")
        }
        const user = {
            id: _user.id,
        }
        const token = jwt.sign(user, config.jwt.secret, {
            expiresIn: expiresIn | 86400
        });
        return token;
    }

    @AuthenticatedHook()
    @Query({ type: () => Utilisateur })
    async userConnected(@Context ctx: GraphQLContext): Promise<Utilisateur> {
        return toObjectType(
            Utilisateur,
            Linq.from(await ctx.repos.utilisateur.GetUtilisateurs({ id: ctx.user.id })).firstOrDefault()
        )
    }
    
}