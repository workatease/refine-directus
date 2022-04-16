import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("createMany", () => {
    it("correct response", async () => {
        const { data } = await dataProvider(client).createMany({
            resource: "post",
            variables: [
                {
                    title: "Test 1",
                },
                {
                    title: "Test 2",
                },
            ],
        });
        console.log(data);
        expect(data[0].title).toEqual("Test 1");
        expect(data[0].id).toBeTruthy();
        expect(data[1].title).toEqual("Test 2");
        expect(data[1].id).toBeTruthy();
    });
});
