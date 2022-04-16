import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("getMany", () => {
    it("correct response", async () => {
        const { data } = await dataProvider(client).getMany({
            resource: "post",
            ids: ["61b886fbd9398", "61b9dd4a6261d"],
        });

        expect(data[0].id).toEqual("61b886fbd9398");
        expect(data[0].title).toEqual("test");

        expect(data[1].id).toEqual("61b9dd4a6261d");
        expect(data[1].title).toEqual("Test4");
    });
});
