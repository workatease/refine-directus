import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("useOne", () => {
    it("correct response with metaData", async () => {
        const { data } = await dataProvider(client).getOne({
            resource: "post",
            id: "2",
        });

        expect(data.id).toEqual(2);
        expect(data.title).toEqual("Test 1");
    });

    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            await dataProvider(client).getOne({
                resource: "unknown",
                id: "2",
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
