import { dataProvider } from "../../src/index";
import client from "../directUsClient";

describe("create", () => {
    fit("correct response with metaData", async () => {
        const { data } = await dataProvider(client).create({
            resource: "post",
            variables: {
                title: "Lorem ipsum dolor",
            },
        });

        console.log(data);

        expect(data.title).toEqual("Lorem ipsum dolor");
        expect(data.id).toBeTruthy();
    });
});
