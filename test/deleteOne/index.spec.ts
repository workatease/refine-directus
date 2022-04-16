import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("deleteOne", () => {
    it("correct response with metaData", async () => {
        const { data } = await dataProvider(client).deleteOne({
            resource: "post",
            id: "61c1a17614a97",
        });

        expect(data.id).toEqual("61c1a17614a97");
    });
});
