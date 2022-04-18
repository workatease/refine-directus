import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("getMany", () => {
    beforeAll(async () => {
        await client.items('post').createMany([{
            id: '99',
            title: 'post 99',
        },
        {
            id: '98',
            title: 'post 98',
        }
        ]);
    });

    it("correct response", async () => {
        const { data } = await dataProvider(client).getMany({
            resource: "post",
            ids: ["99", "98"], metaData: {}
        });

        expect(data[0].id).toEqual(98);
        expect(data[0].title).toEqual("post 98");

        expect(data[1].id).toEqual(99);
        expect(data[1].title).toEqual("post 99");
    });

    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            await dataProvider(client).getMany({
                resource: "unknown",
                ids: ["99", "98"],
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
