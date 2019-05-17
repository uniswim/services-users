import { ObjectType, Field, InputObjectType, InputField, Arg, Context } from "@dadoudidou/typegql";
import { GQLScalarDate } from "./../Scalars/Date"
import Abilite from "./Abilite";
import { GraphQLContext } from "@graphQL/*";
import { toObjectType } from "../../Helpers/ToObjectType";
import Role from "./Role";

@ObjectType()
export default class Application {

    @Field()
    id: number

    @Field()
    nom: string;

    @Field({ type: GQLScalarDate })
    date_created_gmt: Date;

    @Field({ type: () => [Abilite] })
    async abilites(@Context ctx: GraphQLContext): Promise<Abilite[]> {
        let abilites: any[] = await ctx.models.Abilite.findAll({ include:[{ model:ctx.models.Application, where: { id: this.id } }] });
        return abilites.map(x => toObjectType(Abilite, x));
    }

    @Field({ type: () => [Role] })
    async roles(@Context ctx: GraphQLContext): Promise<Role[]> {
        let roles: any[] = await ctx.models.Role.findAll({ include:[{ model:ctx.models.Application, where: { id: this.id } }] });
        return roles.map(x => toObjectType(Role, x));
    }
}

