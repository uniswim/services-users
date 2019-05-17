import { Before } from "@dadoudidou/typegql";
import { GraphQLContext } from "@graphQL/*";
import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import { Ability } from "@casl/ability"

export const AuthenticatedHook = () => {
    return Before(({ context }) => {
        if(!(context as GraphQLContext).user){
            throw new AuthenticationError("Vous devez vous authentifier afin d'accèder au contenu.");
        }
    })
}

export const OwnerHook = () => {
    return Before(({ context, source }) => {
        let _ctx = context as GraphQLContext;
        if(!_ctx.user) throw new AuthenticationError("Vous devez vous authentifier afin d'accèder au contenu.");
        console.log("-----------------")
        console.log(source, _ctx.user.id);
        if(source.id == _ctx.user.id) return;
        throw new AuthenticationError("Vous n'avez pas les abilités suffisantes pour accèder à ce contenu.");
    })
}

export const CanHook = (action: string, subject: any, field?: string) => {
    return Before(({ context }) => {
        let _ctx = context as GraphQLContext;
        if(!_ctx.user) throw new AuthenticationError("Vous devez vous authentifier afin d'accèder au contenu.");
        if(!_ctx.user.ability) throw new AuthenticationError("Impossible d'accèder à vos abilités.");
        let _rep = _ctx.user.ability.can(action, subject, field);
        if(!_rep) throw new ForbiddenError("Vous n'avez pas les abilités suffisantes pour accèder à ce contenu.");
    })
}