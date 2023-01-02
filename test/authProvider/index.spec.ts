import { authProvider } from "../../src";
import directus, { noAuthDirectus } from "../directUsClient";
import jwt from "jsonwebtoken";

describe("authProvider", () => {

    it("correct response", async () => {
        const response = await authProvider(noAuthDirectus).login({ username: "jest@test.com", password: "test" });
        expect(response).toBe("/");
    });

    it("correct response with redirectPath", async () => {
        const response = await authProvider(noAuthDirectus).login({ username: "jest@test.com", password: "test", redirectPath: "/login" });
        expect(response).toBe("/login");
    });

    it("error response", async () => {
        expect.assertions(2);
        try {
            await authProvider(noAuthDirectus).login({ username: "", password: "test" });
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('"email" is not allowed to be empty');
        }
    });

    it("checkError 401 rejects", async () => {
        await expect(authProvider(noAuthDirectus).checkError({ status: 401 })).rejects.toBe(undefined);
    });


    it("checkError 403 resolves", async () => {
        await expect(authProvider(noAuthDirectus).checkError({ status: 403 })).rejects.toBe(undefined);
    });

    it("checkError 500 resolves", async () => {
        await expect(authProvider(noAuthDirectus).checkError({ status: 500 })).resolves.toBe(undefined);
    });
    
    it("checkAuth rejects", async () => {
        expect.assertions(1);
        try {
            await authProvider(noAuthDirectus).checkAuth();
        } catch (error: any) {
            expect(error.message).toBe('Invalid user credentials.');
        }
    });

    it("checkAuth resolve", async () => {
        await expect(authProvider(directus).checkAuth()).resolves.toBe(undefined);

    });

    it("logout", async () => {
        expect.assertions(2);
        try {
            await authProvider(noAuthDirectus).logout(null);
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('"refresh_token" is required in either the JSON payload or Cookie');
        }
    });

    it("getPermissions rejects", async () => {
        expect.assertions(1);
        try {
            await authProvider(noAuthDirectus).getPermissions();
        } catch (error: any) {
            expect(error.message).toBe("You don't have permission to access this.");
        }
    });

    it("getPermissions ", async () => {
        const response = await authProvider(directus).getPermissions();
        const { data } = response;
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expect(data[0]).toHaveProperty("role");
    });


    it("getUserIdentity rejects", async () => {
        expect.assertions(1);
        const auth = authProvider(noAuthDirectus);
        if (auth.getUserIdentity) {
            try {
                await auth.getUserIdentity();
            } catch (error: any) {
                expect(error.message).toBe("Invalid user credentials.");
            }
        }
    });

    it("getUserIdentity ", async () => {
        const auth = authProvider(directus);
        if (auth.getUserIdentity) {
            const response = await auth.getUserIdentity();
            expect(response).toBeInstanceOf(Object);
            expect(response).toHaveProperty("id");
            expect(response.first_name).toBe("Admin");
        }
    });

});