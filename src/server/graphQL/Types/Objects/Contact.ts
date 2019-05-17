import { ObjectType, Field, InputObjectType, InputField } from "@dadoudidou/typegql";

@ObjectType()
export default class Contact {

    @Field()
    id: number

    @Field()
    nom: string;

    @Field()
    prenom: string;

    @Field()
    actif: boolean;

    @Field()
    telephone_fixe: string;

    @Field()
    telephone_portable: string;

    @Field()
    email: string;
}