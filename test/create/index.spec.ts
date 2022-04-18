import { dataProvider } from "../../src/index";
import client from "../directUsClient";

describe("create", () => {
    it("correct response with metaData", async () => {
        const { data } = await dataProvider(client).create({
            resource: "post",
            variables: {
                id: "1",
                title: "Lorem ipsum dolor",
            },
        });
        expect(data.title).toEqual("Lorem ipsum dolor");
        expect(data.id).toBeTruthy();
    });

    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            const { data } = await dataProvider(client).create({
                resource: "post",
                variables: {
                    id: "1",
                    title: "Lorem ipsum dolor",
                },
            });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty(
                "message",
                "Field \"id\" has to be unique.",
            );
        }
    });
});
