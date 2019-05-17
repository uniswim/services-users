import { ObjectType, Field, InputObjectType, InputField } from "@dadoudidou/typegql";
import { GQLScalarJSON } from "./../Scalars/JSON"

@ObjectType()
export default class Abilite {

    @Field()
    id: number

    @Field()
    nom: string;

    @Field()
    description: string;

    @Field()
    template: string;
}