import { ObjectType, Field, Context } from "@dadoudidou/typegql";
import { GQLScalarJSON } from "./../Scalars/JSON"
import { RawRule } from "@casl/ability";
import { GraphQLContext } from "@graphQL/*";
import Client from "./Client";
import { toObjectType, toObjectTypeArray } from "../../Helpers/ToObjectType";
import { OwnerHook } from "./../../Hooks";
import { defineAbilitiesForUser } from "./../../../../utils/Abilities";

@ObjectType()
export default class Utilisateur {
    @Field()
    id: number

    @Field()
    login: string

    @Field()
    nom: string

    @Field()
    prenom: string

    @Field()
    email: string

    @Field({ type: GQLScalarJSON })
    async rawRules(@Context ctx: GraphQLContext): Promise<any>{
        let ability = await defineAbilitiesForUser(await ctx.models.Utilisateur.findByPk(this.id));
        return ability.rules;
    }

    @OwnerHook()
    @Field({ type: () => [Client] })
    async clients(@Context ctx: GraphQLContext): Promise<Client[]> {
        return toObjectTypeArray<Client>(
            Client,
            await ctx.models.Utilisateur.findByPk(this.id, { include: [{model: ctx.models.Client}] })
            .then(user => {
                if(!user) return [];
                return user.clients
            })
        );
    }
}

