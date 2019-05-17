import Client from "../models/Client";
import database from "@database/*";


export const GetClient = async (client_id: number) : Promise<Client> => {
    return await database.models.Client.findByPk(client_id);
}

