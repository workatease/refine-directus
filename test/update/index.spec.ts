import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("update", () => {
    it("correct response", async () => {
        const { data } = await dataProvider(client).update({
            resource: "post",
            id: "61b9dd4a6261d",
            variables: {
                title: "Updated Title",
                content: "Updated Content",
            },
        });

        expect(data.id).toEqual("61b9dd4a6261d");
        expect(data.title).toEqual("Updated Title");
        expect(data.content).toEqual("Updated Content");
        expect(data.categoryId).toEqual("61811751a3b04");
    });
});
