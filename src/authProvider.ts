import { AuthProvider } from "@pankod/refine-core";
import { AuthResult, IDirectus } from '@directus/sdk';
import { CustomTypes } from "./helpers/interface";

export const authProvider = (directus: IDirectus<CustomTypes>): AuthProvider => ({
    login: async ({ username, password }) => {
        try {

            const response: AuthResult = await directus.auth.login({ email: username, password: password });
            return response.access_token;
        } catch (e) {
            console.log(e);
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("Invalid Email and password combination");
        }
    },
    logout: async () => {
        try {
            await directus.auth.logout()
            return;
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                throw error;
            }
            return false;
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
            } else {
                return Promise.reject();
            }
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                return Promise.reject(error);
            }
            return Promise.reject(new Error("unable to check auth"));

        }
    },
    getPermissions: async () => {
        try {
            const response = await directus.permissions.readByQuery();
            return Promise.resolve(response);
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                return Promise.reject(error);
            }
            return Promise.reject(new Error("unable to get permissions"));
        }
    },
    getUserIdentity: async () => {
        try {
            return directus.users.me.read()
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                return Promise.reject(error);
            }
            return Promise.reject();
        }
    },
});