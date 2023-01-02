import { AuthProvider } from "@pankod/refine-core";
import { AuthResult, IDirectus } from '@directus/sdk';
import { CustomTypes } from "./helpers/interface";

export const authProvider = (directus: IDirectus<CustomTypes>): AuthProvider => ({
    login: async ({ username, password, redirectPath }) => {
        try {

            await directus.auth.login({ email: username, password: password });
            return redirectPath ? redirectPath : '/';
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    logout: async () => {
        try {
            return await directus.auth.logout();
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    checkError: (error) => {
        if (error.status === 401 || error.status === 403) {
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: async () => {
        try {
            let params:any = {
                rnd:JSON.stringify(new Date().getTime())
            };
            const response = await directus.users.me.read(params)
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
            let params:any = {
                rnd:JSON.stringify(new Date().getTime())
            };
            const response = await directus.permissions.readByQuery(params);
            return Promise.resolve(response);
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    },
    getUserIdentity: async () => {
        try {
            let params:any = {
                rnd:JSON.stringify(new Date().getTime())
            };
            return await directus.users.me.read(params)
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    },
});