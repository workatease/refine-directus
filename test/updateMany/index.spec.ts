import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("updateMany", () => {
    it("correct response with metaData", async () => {
        const { data } = await dataProvider(client).updateMany({
            resource: "post",
            ids: ["2", "3"],
            variables: {
                title: "Batch updated content",
            },
        });
        expect(data[0].id).toEqual(2);
        expect(data[0].title).toEqual("Batch updated content");

        expect(data[1].id).toEqual(3);
        expect(data[1].title).toEqual("Batch updated content");
    });

    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            await dataProvider(client).updateMany({
                resource: "unknown",
                ids: ["2", "3"],
                variables: {
                    title: "Batch updated content",
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
