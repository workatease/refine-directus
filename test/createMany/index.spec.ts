import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("createMany", () => {
    it("correct response", async () => {
        const { data } = await dataProvider(client).createMany({
            resource: "post",
            variables: [
                {
                    id: "2",
                    title: "Test 1",
                },
                {
                    id: "3",
                    title: "Test 2",
                },
            ],
        });
        expect(data[0].title).toEqual("Test 1");
        expect(data[0].id).toBeTruthy();
        expect(data[1].title).toEqual("Test 2");
        expect(data[1].id).toBeTruthy();
    });


    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            await dataProvider(client).createMany({
                resource: "unknown",
                variables: [
                    {
                        id: "2",
                        title: "Test 1",
                    },
                    {
                        id: "3",
                        title: "Test 2",
                    },
                ],
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
