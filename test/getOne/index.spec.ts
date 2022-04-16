import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("useOne", () => {
    it("correct response with metaData", async () => {
        const { data } = await dataProvider(client).getOne({
            resource: "post",
            id: "61b9dd4a6261d",
        });

        expect(data.id).toEqual("61b9dd4a6261d");
    });
});
