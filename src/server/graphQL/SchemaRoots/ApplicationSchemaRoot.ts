import { SchemaRoot, Query, Context, ObjectType, Mutation, InputField, Field, Arg, After  } from "@dadoudidou/typegql"
import { GraphQLContext } from "@graphQL/*";
import { toObjectType, toObjectTypeArray } from "../Helpers/ToObjectType";
import Application from "../Types/Objects/Application";
import ApplicationInput from "../Types/Inputs/ApplicationInput";
import { GraphQLBoolean } from "graphql";
import RoleInput from "../Types/Inputs/RoleInput";
import Role from "../Types/Objects/Role";
import AbiliteInput from "../Types/Inputs/AbiliteInput";
import Abilite from "../Types/Objects/Abilite";
import { CanHook, AuthenticatedHook } from "../Hooks/index";

@ObjectType()
class RoleMutation {
    private readonly _id: number;
    private readonly _app_id: number;
    constructor(app_id: number, id: number){
        this._id = id;
        this._app_id = app_id;
    }

    @Field({ type: Boolean, description: "Ajoute une abilité à un role" })
    async addAbilite(abilite_id: number, @Context ctx: GraphQLContext): Promise<boolean> {

        let _app = await ctx.models.Application.findByPk(this._app_id);
        if(!_app) throw new Error(`Application with ${this._app_id} not found`);

        let _abilite: any[] = await _app.$get("abilites", { where: { id: abilite_id } });
        if(_abilite.length == 0)  throw new Error(`Abilite with ${abilite_id} not found`);

        let _role: any[] = await _app.$get("roles", { where: { id: this._id } });
        if(_role.length == 0)  throw new Error(`Role with ${this._id} not found`);

        await _role[0].$add("abilite", _abilite[0]);
        return true;
    }

    @Field({ type: Boolean, description: "Retire une abilité à un role" })
    async removeAbilite(abilite_id: number, @Context ctx: GraphQLContext): Promise<boolean> {

        let _app = await ctx.models.Application.findByPk(this._app_id);
        if(!_app) throw new Error(`Application with ${this._app_id} not found`);

        let _abilite: any[] = await _app.$get("abilites", { where: { id: abilite_id } });
        if(_abilite.length == 0)  throw new Error(`Abilite with ${abilite_id} not found`);

        let _role: any[] = await _app.$get("roles", { where: { id: this._id } });
        if(_role.length == 0)  throw new Error(`Role with ${this._id} not found`);

        await _role[0].$remove("abilite", _abilite[0]);
        return true;
    }
}

@ObjectType()
export class ApplicationMutation {
    private readonly _id: number;
    constructor(id: number){
        this._id = id;
    }

    @Field({ type: Application, description: "Met à jour les informations d'une application" })
    async update(data: ApplicationInput, @Context ctx: GraphQLContext): Promise<Application> {
        if(!this._id) throw new Error("id is not defined");
        return toObjectType(
            Application, 
            await ctx.models.Application.findByPk(this._id)
            .then(application => {
                if(!application) throw new Error(`Application with ${this._id} not found`);
                return application;
            })
            .then(application => {
                application.nom = data.nom;
                return application.save()
            }))
    }

    @Field({ type: GraphQLBoolean, description: "Active une application" })
    async enable(@Context ctx: GraphQLContext): Promise<boolean> {
        return Promise.resolve(true);
    }

    @Field({ type: GraphQLBoolean, description: "Désactive une application" })
    disable(@Context ctx: GraphQLContext): Promise<boolean> {
        return Promise.resolve(true);
    }

    @Field({ type: Role, description: "Ajoute un role à une application" })
    async createRole(data: RoleInput, @Context ctx: GraphQLContext): Promise<Role> {
        let application = await ctx.models.Application.findByPk(this._id);
        if(!application) throw new Error(`Application with ${this._id} not found`);
        let _role = await application.$create("role",{ 
            nom: data.nom, 
            description: data.description 
        });
        return toObjectType(Role, _role);
    }

    @Field({ type: GraphQLBoolean, description: "Supprime un role à une application" })
    async removeRole(role_id: number, @Context ctx: GraphQLContext): Promise<boolean> {
        let application = await ctx.models.Application.findByPk(this._id);
        if(!application) throw new Error(`Application with ${this._id} not found`);
        let roles: any[] = await application.$get("roles", { where: { id: role_id } });
        if(roles.length == 0) return true;
        await roles[0].destroy();
        return true;
    }

    @Field({ type: Abilite, description: "Ajoute une abilité à une application" })
    async createAbilite(data: AbiliteInput, @Context ctx: GraphQLContext): Promise<Abilite> {
        let application = await ctx.models.Application.findByPk(this._id);
        if(!application) throw new Error(`Application with ${this._id} not found`);
        let _abilite = await application.$create("abilite", {
            nom: data.nom, 
            description: data.description,
            actions: data.actions,
            conditions: data.conditions,
            sujets: data.sujets
        })
        return toObjectType(Abilite, _abilite);
    }

    @Field({ type: GraphQLBoolean, description: "Supprime une abilité à une application" })
    async removeAbilite(abilite_id: number, @Context ctx: GraphQLContext): Promise<boolean> {
        let application = await ctx.models.Application.findByPk(this._id);
        if(!application) throw new Error(`Application with ${this._id} not found`);
        let abilites: any[] = await application.$get("abilites", { where: { id: abilite_id } });
        if(abilites.length == 0) return true;
        await abilites[0].destroy();
        return true;
    }

    @Field()
    RoleMutate(id: number): RoleMutation {
        return new RoleMutation(this._id, id);
    }
}

@SchemaRoot()
export default class ApplicationSchemaRoot {
    
    @AuthenticatedHook()
    @CanHook("manage", "all")
    @Mutation({ type: Application, description: "Crée une nouvelle application" })
    async createApplication(data: ApplicationInput, @Context ctx: GraphQLContext): Promise<Application> {
        return toObjectType(
            Application, 
            await ctx.models.Application.create({ nom: data.nom })
        );
    }

    @AuthenticatedHook()
    @CanHook("manage", "all")
    @Mutation()
    applicationMutate(id: number, @Context ctx: GraphQLContext): ApplicationMutation {
        return new ApplicationMutation(id);
    }

    @AuthenticatedHook()
    @CanHook("manage", "all")
    @Query({ type: Application , description: "Récupère les informations d'une application"})
    async application(id: number, @Context ctx: GraphQLContext): Promise<Application> {
        return toObjectType(
            Application, 
            await ctx.models.Application.findById(id)
            .then(application => {
                if(!application) throw new Error(`Application with ${id} not found`);
                return application;
            })
        )
    }

    @AuthenticatedHook()
    @CanHook("manage", "all")
    @Query({ type: [Application] , description: "Liste les applications"})
    async applications(@Context ctx: GraphQLContext): Promise<Application[]> {
        return toObjectTypeArray(
            Application, 
            await ctx.models.Application.findAll()
        )
    }
    
}


