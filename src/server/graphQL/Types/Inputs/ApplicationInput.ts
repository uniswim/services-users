import { ObjectType, Field, InputObjectType, InputField } from "@dadoudidou/typegql";

@InputObjectType()
export default class ApplicationInput {
    @InputField()
    nom: string;
}

