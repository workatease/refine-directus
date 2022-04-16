import { dataProvider } from "../../src/index";
import client from "../directUsClient";

describe("custom", () => {
    it("throws error when called", async () => {
        expect.assertions(2);

        try {
            await dataProvider(client).custom?.({
                url: "test",
                method: "get",
            });
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err).toHaveProperty(
                "message",
                "'custom' method is not implemented on refine-appwrite data provider.",
            );
        }
    });
});
