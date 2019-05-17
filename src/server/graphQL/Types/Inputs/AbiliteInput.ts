import { ObjectType, Field, InputObjectType, InputField } from "@dadoudidou/typegql";

@InputObjectType()
export default class AbiliteInput {
    @InputField()
    nom: string;

    @InputField()
    description: string;

    @InputField()
    actions: string;

    @InputField()
    sujets: string;

    @InputField({ isNullable: true })
    conditions: string;
}

