import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("update", () => {
    it("correct response", async () => {
        const { data } = await dataProvider(client).update({
            resource: "post",
            id: "3",
            variables: {
                title: "Updated Title",
                status: "published",
            },
        });

        expect(data.id).toEqual(3);
        expect(data.title).toEqual("Updated Title");
        expect(data.status).toEqual("published");
    });

    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            await dataProvider(client).update({
                resource: "unknown",
                id: "3",
                variables: {
                    title: "Updated Title",
                    status: "published",
                },
            });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty(
                "message",
                "You don't have permission to access this.",
            );
        }
    });
});
