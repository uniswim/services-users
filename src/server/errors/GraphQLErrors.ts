
export class GraphQLServerError extends Error {
    statusCode: number = 500;
}

export class UnhautorizedError extends GraphQLServerError {
    statusCode = 401;
    message = "Vous n'êtes pas autorisé à accéder à ce contenu."
}