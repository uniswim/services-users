import { ObjectType, Field, InputObjectType, InputField, Context } from "@dadoudidou/typegql";
import Abilite from "./Abilite";
import { GraphQLContext } from "@graphQL/*";
import { toObjectType } from "../../Helpers/ToObjectType";

@ObjectType()
export default class Role {

    @Field()
    id: number

    @Field()
    nom: string;

    @Field()
    description: string;

    @Field({ type: () => [Abilite] })
    async abilites(@Context ctx: GraphQLContext): Promise<Abilite[]> {
        let abilites: any[] = await ctx.models.Abilite.findAll({ include:[{ model:ctx.models.Role, where: { id: this.id } }] });
        return abilites.map(x => toObjectType(Abilite, x));
    }
}