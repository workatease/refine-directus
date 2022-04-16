import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("getList", () => {
    it("correct response", async () => {
        const { data, total } = await dataProvider(client).getList({
            resource: "post",
        });

        expect(data[0].id).toBe("61c300118b05b");
        expect(data[0].title).toBe("Test");
        expect(total).toBe(2);
    });

    it("correct sorting response", async () => {
        const { data, total } = await dataProvider(client).getList({
            resource: "post",
            sort: [
                {
                    field: "id",
                    order: "desc",
                },
            ],
        });

        expect(data[0].id).toBe("61c301bca8edf");
        expect(data[0].title).toBe("Test 2");

        expect(data[1].id).toBe("61c300118b05b");
        expect(data[1].title).toBe("Test");

        expect(total).toBe(2);
    });

    it("correct filter response", async () => {
        const { data, total } = await dataProvider(client).getList({
            resource: "post",
            filters: [
                {
                    field: "id",
                    operator: "eq",
                    value: "61c300118b05b",
                },
            ],
        });

        expect(data[0].id).toBe("61c300118b05b");
        expect(data[0].title).toBe("Test");
        expect(total).toBe(1);
    });

    it("throws when given an unsupported operator", async () => {
        expect.assertions(2);

        try {
            await dataProvider(client).getList({
                resource: "post",
                filters: [
                    {
                        field: "id",
                        operator: "in",
                        value: "61c300118b05b",
                    },
                ],
            });
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err).toHaveProperty(
                "message",
                "Operator in is not supported",
            );
        }
    });

    it("throws when given more than one sorter", async () => {
        expect.assertions(2);

        try {
            await dataProvider(client).getList({
                resource: "post",
                sort: [
                    {
                        field: "id",
                        order: "desc",
                    },
                    {
                        field: "content",
                        order: "asc",
                    },
                ],
            });
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err).toHaveProperty(
                "message",
                "Appwrite data provider does not support multiple sortings",
            );
        }
    });
});
