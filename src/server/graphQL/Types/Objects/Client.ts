import { ObjectType, Field, InputObjectType, InputField, Context, Arg } from "@dadoudidou/typegql";
import Application from "./Application";
import { GraphQLContext } from "@graphQL/*";
import { toObjectType } from "../../Helpers/ToObjectType";
import { GQLScalarDate } from "../Scalars/Date";
import Contact from "./Contact";
import Utilisateur from "./Utilisateur";

@ObjectType()
export default class Client {

    @Field()
    id: number

    @Field()
    raison_sociale: string;

    @Field()
    adresse: string;

    @Field()
    code_postal: string;

    @Field()
    ville: string;

    @Field({ type: [Application], description: "Liste des applications" })
    async applications(@Arg({ isNullable: true }) application_id: number, @Context ctx: GraphQLContext): Promise<Application[]> {
        //let client = await ctx.models.Client.findByPk(this.id);
        //let applications: any[] = await client.$get("applications");
        let applications: any[] = await ctx.models.Application.findAll({ include:[{ model:ctx.models.Client, where: { id: this.id } }] });
        return applications.map(x => toObjectType(Application, x));
    }

    @Field({ type: [Contact], description: "Liste des contacts" })
    async contacts(@Arg({ isNullable: true }) contact_id: number, @Context ctx: GraphQLContext): Promise<Contact[]> {
        let contacts: any[] = await ctx.models.Contact.findAll({ where: { client_id: this.id } });
        return contacts.map(x => toObjectType(Contact, x));
    }

    @Field({ type: () => [Utilisateur], description: "Liste des utilisateurs" })
    async utilisateurs(@Arg({ isNullable: true }) utilisateur_id: number, @Context ctx: GraphQLContext): Promise<Utilisateur[]> {
        let utilisateurs: any[] = await ctx.models.Utilisateur.findAll({ include:[{ model:ctx.models.Client, where: { id: this.id } }] });
        return utilisateurs.map(x => toObjectType(Utilisateur, x));
    }

    @Field({ type: GQLScalarDate })
    date_created_gmt: Date;
}

