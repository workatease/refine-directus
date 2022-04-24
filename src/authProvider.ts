import { AuthProvider } from "@pankod/refine-core";
import { AuthResult, IDirectus } from '@directus/sdk';
import { CustomTypes } from "./helpers/interface";

export const authProvider = (directus: IDirectus<CustomTypes>): AuthProvider => ({
    login: async ({ username, password }) => {
        try {

            const response: AuthResult = await directus.auth.login({ email: username, password: password });
            return response.access_token;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    logout: async () => {
        try {
            return await directus.auth.logout()
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    checkError: (error) => {
        if (error.status === 401) {
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: async () => {
        try {
            const response = await directus.users.me.read()
            if (response) {
                return Promise.resolve();
            }
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    },
    getPermissions: async () => {
        try {
            const response = await directus.permissions.readByQuery();
            return Promise.resolve(response);
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    },
    getUserIdentity: async () => {
        try {
            return await directus.users.me.read()
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    },
});