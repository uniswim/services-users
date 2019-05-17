import { SchemaRoot, Query, Context, ObjectType, Mutation, InputField, Field, Arg, After, InputObjectType  } from "@dadoudidou/typegql"
import { GraphQLContext } from "@graphQL/*";
import Client from "../Types/Objects/Client";
import ClientInput from "../Types/Inputs/ClientInput";
import { GraphQLInt, GraphQLBoolean } from "graphql";
import { toObjectType } from "../Helpers/ToObjectType";
import UtilisateurInput from "../Types/Inputs/UtilisateurInput";
import Utilisateur from "../Types/Objects/Utilisateur";
import Contact from "../Types/Objects/Contact";
import ContactInput from "../Types/Inputs/ContactInput";
import { AuthenticatedHook, CanHook } from "../Hooks/index";
import { Linq } from "@utils/*";

@ObjectType()
class UtilisateurMutation {
    private readonly _id: number;
    private readonly _client_id: number;
    constructor(client_id:number, id: number){
        this._id = id;
        this._client_id = client_id;
    }

    @Field({ type: Boolean, description: "Ajoute une abilité à un utilisateur" })
    async addAbilite(abilite_id: number, @Context ctx: GraphQLContext): Promise<boolean> {

        let _client = await ctx.models.Client.findByPk(this._client_id);
        if(!_client) throw new Error(`Client with ${this._client_id} not found`);

        let _users: any[] = await _client.$get("utilisateurs", { where: { id: this._id } });
        if(_users.length == 0)  throw new Error(`Utilisateur with ${this._id} not found`);

        let _abilite = await ctx.models.Abilite.findByPk(abilite_id);
        if(!_abilite)  throw new Error(`Abilite with ${abilite_id} not found`);

        await _users[0].$add("abilite", _abilite);
        return true;
    }

    @Field({ type: Boolean, description: "Retire une abilité à un role" })
    async removeAbilite(abilite_id: number, @Context ctx: GraphQLContext): Promise<boolean> {

        let _client = await ctx.models.Client.findByPk(this._client_id);
        if(!_client) throw new Error(`Client with ${this._client_id} not found`);

        let _users: any[] = await _client.$get("utilisateurs", { where: { id: this._id } });
        if(_users.length == 0)  throw new Error(`Utilisateur with ${this._id} not found`);

        let _abilite = await ctx.models.Abilite.findByPk(abilite_id);
        if(!_abilite)  throw new Error(`Abilite with ${abilite_id} not found`);

        await _users[0].$remove("abilite", _abilite);
        return true;
    }

    @Field({ type: Utilisateur, description: "Met à jour les informations d'un utilisateur" })
    async update(data: UtilisateurInput, @Context ctx: GraphQLContext): Promise<Utilisateur> {

        let _user = await ctx.repos.utilisateur.UpdateUtilisateur(this._id, {
            nom: data.nom,
            prenom: data.prenom
        });
        return toObjectType(Utilisateur, _user);
    }

}

@ObjectType()
export class ClientMutation {
    private readonly _id: number;
    constructor(id: number){
        this._id = id;
    }

    @Field({ type: Client, description: "Met à jour les informations d'un client" })
    async update(data: ClientInput, @Context ctx: GraphQLContext): Promise<Client> {
        return toObjectType(
            Client, 
            await ctx.models.Client.findByPk(this._id)
            .then(client => {
                if(!client) throw new Error(`Client with ${this._id} not found`);
                return client;
            })
            .then(client => {
                client.raison_sociale = data.raison_sociale;
                client.adresse = data.adresse;
                client.code_postal = data.code_postal;
                client.ville = data.ville;
                return client.save()
            }))
    }

    @Field({ type: GraphQLBoolean, description: "Active un client" })
    async enable(@Context ctx: GraphQLContext): Promise<boolean> {
        return Promise.resolve(true);
    }

    @Field({ type: GraphQLBoolean, description: "Désactive un client" })
    disable(@Context ctx: GraphQLContext): Promise<boolean> {
        return Promise.resolve(true);
    }

    @Field({ type: GraphQLBoolean, description: "Ajoute une application au client" })
    async addApplication(@Arg({ isNullable: false }) application_id: number, @Context ctx: GraphQLContext): Promise<boolean> {
        return ctx.models.Client.findByPk(this._id)
            .then(async client => {
                if(!client) throw new Error(`Client with ${this._id} not found`);
                let application = await ctx.models.Application.findById(application_id);
                if(!application) throw new Error(`Application with ${application_id} not found`);
                client.$add("application", application);
                return true;
            })
    }

    @Field({ type: GraphQLBoolean, description: "Retire une application au client" })
    async removeApplication(@Arg({ isNullable: false }) application_id: number, @Context ctx: GraphQLContext): Promise<boolean> {
        return ctx.models.Client.findByPk(this._id)
            .then(async client => {
                if(!client) throw new Error(`Client with ${this._id} not found`);
                let application = await ctx.models.Application.findById(application_id);
                if(!application) throw new Error(`Application with ${application_id} not found`);
                client.$remove("application", application);
                return true;
            })
    }

    @Field({ type: Utilisateur, description: "Crée un utilisateur" })
    async createUtilisateur(email: string, password: string, data: UtilisateurInput, @Context ctx: GraphQLContext): Promise<Utilisateur> {
        let _user = await ctx.repos.utilisateur.CreateUtilisateur(this._id, {
            nom: data.nom,
            prenom: data.prenom,
            email: email,
            password: password
        });
        return toObjectType(Utilisateur, _user);
    }

    @Field()
    UtilisateurMutate(id: number): UtilisateurMutation {
        return new UtilisateurMutation(this._id, id);
    }

    @Field({ type: Contact, description: "Crée un contact" })
    async createContact(data: ContactInput, @Context ctx: GraphQLContext): Promise<Contact> {
        let _client = await ctx.models.Client.findByPk(this._id);
        if(!_client) throw new Error(`Client with id '${this._id}' not found`);

        return toObjectType(
            Contact,
            await _client.$create("contact", {
                nom: data.nom,
                prenom: data.prenom,
                actif: true,
                telephone_fixe: data.telephone_fixe,
                telephone_portable: data.telephone_portable,
                email: data.email
            })
        )
    }

    @Field({ type: Contact, description: "Crée un contact" })
    async updateContact(contact_id: number, data: ContactInput, @Context ctx: GraphQLContext): Promise<Contact> {
        let _client = await ctx.models.Client.findByPk(this._id);
        if(!_client) throw new Error(`Client with id '${this._id}' not found`);

        let _contact: any = await _client.$get("contacts", { id: contact_id });
        if((_contact as any[]).length == 0) throw new Error(`Contact with id '${contact_id}' not found`);
        _contact = (_contact as any[])[0];
        
        _contact.nom = data.nom || _contact.nom;
        _contact.prenom = data.prenom || _contact.prenom;
        _contact.actif = data.actif || _contact.actif;
        _contact.telephone_fixe = data.telephone_fixe || _contact.telephone_fixe;
        _contact.telephone_portable = data.telephone_portable || _contact.telephone_portable;
        _contact.email = data.email || _contact.email;

        _contact = await _contact.save();

        return toObjectType( Contact, _contact);
    }
}



@InputObjectType()
export class QueryUtilisateurInput {
    @InputField()
    id: number
}

@SchemaRoot()
export default class ClientSchemaRoot {
    
    @AuthenticatedHook()
    @CanHook("manage", "all")
    @Mutation({ type: Client, description: "Crée un nouveau client" })
    async createClient(data: ClientInput, @Context ctx: GraphQLContext): Promise<Client> {
        let _client = await ctx.models.Client.create({
            adresse: data.adresse,
            code_postal: data.code_postal,
            raison_sociale: data.raison_sociale,
            ville: data.ville
        });
        return toObjectType(Client, _client);
    }

    @Mutation()
    clientMutate(id: number, @Context ctx: GraphQLContext): ClientMutation {
        return new ClientMutation(id);
    }

    @AuthenticatedHook()
    @Query({ type: Client , description: "Récupère les informations d'un client"})
    async Client(id: number, @Context ctx: GraphQLContext): Promise<Client> {
        return toObjectType(
            Client, 
            await ctx.models.Client.findById(id)
            .then(client => {
                if(!client) throw new Error(`Client with ${id} not found`);
                return client;
            })
        )
    }

    @AuthenticatedHook()
    @Query({ type: Utilisateur , description: "Récupère les informations d'un utilisateur"})
    async Utilisateur(id: number, @Context ctx: GraphQLContext): Promise<Utilisateur> {
        let _user = Linq.from(await ctx.repos.utilisateur.GetUtilisateurs({ id: id })).firstOrDefault();
        if(!_user) throw new Error(`Utilisateur with id:${id} not found`);
        return toObjectType(
            Utilisateur, 
            _user
        )
    }
    
}


