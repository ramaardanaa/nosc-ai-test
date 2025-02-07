import { UserRepository } from "../models";

async function getUserById(id: string) {
    return UserRepository().findOne({ where: { id } });
}

async function getUserByEmail(email: string) {
    return UserRepository().findOne({ where: { email } });
}

async function createUser(name: string, email: string, role: string) {
    const insertResult = await UserRepository().insert({ name, email, role });
    const createdUserId = insertResult.generatedMaps[0].id;

    return this.getUserById(createdUserId);
}

async function updateUser(id: string, name: string, email: string, role: string) {
    return UserRepository().update(id, { name, email, role });
}


export default {
    getUserById,
    getUserByEmail,
    createUser,
    updateUser
};