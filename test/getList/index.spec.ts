import { SDK } from "@workatease/refine-directus8";
import { dataProvider, ManyItems, ID } from "../../src/index";
import client from "../directUsClient";


describe("getList", () => {
    beforeAll(async () => {
        const res: ManyItems<any> = await client.items('post').readByQuery({ fields: ['id'] });
        const ids: ID[] = res?.data?.map(item => item?.id || 0 as ID) || [];
        client.items('post').deleteMany(ids);
        await client.items('post').createMany([
            {
                id: "80",
                title: "Test 1",
            },
            {
                id: "81",
                title: "Test 2",
            },
            {
                id: "82",
                title: "not this",
            },
        ]);
    });
    it("correct response", async () => {
        const res = await dataProvider(client).getList({
            resource: "post",
        });
        expect(res.data).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 80, title: "Test 1" }),
            expect.objectContaining({ id: 82, title: "not this" }),
            expect.objectContaining({ id: 81, title: "Test 2" }),
        ]))
        expect(res.total).toBe(3);
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
        expect(data[0].id).toBe(82);
        expect(data[0].title).toBe("not this");

        expect(data[1].id).toBe(81);
        expect(data[1].title).toBe("Test 2");

        expect(data[2].id).toBe(80);
        expect(data[2].title).toBe("Test 1");

        expect(total).toBe(3);
    });

    it("correct filter response", async () => {
        const { data, total } = await dataProvider(client).getList({
            resource: "post",
            filters: [
                {
                    field: "id",
                    operator: "eq",
                    value: "80",
                },
            ],
        });

        expect(data[0].id).toBe(80);
        expect(data[0].title).toBe("Test 1");
        expect(total).toBe(1);
    });

    it("search query", async () => {
        const { data, total } = await dataProvider(client).getList({
            resource: "post",
            filters: [
                {
                    field: "search",
                    operator: "eq",
                    value: "not",
                },
            ],
            sort: [
                { field: "id", order: "desc" },
            ]
        });

        expect(data[0].id).toBe(82);
        expect(data[0].title).toBe("not this");
        expect(total).toBe(1);
    });

    it("Or Logic search", async () => {
        const { data, total } = await dataProvider(client).getList({
            resource: "post",
            filters: [
                {
                    operator: "or",
                    value: [
                        {
                            field: "id",
                            operator: "eq",
                            value: "80",
                        }, {
                            field: "id",
                            operator: "eq",
                            value: "81",
                        }
                    ],
                },
            ],
            sort: [
                { field: "id", order: "asc" },
            ]
        });

        expect(data[0].id).toBe(80);
        expect(data[0].title).toBe("Test 1");
        expect(total).toBe(2);
    });

    it("throws when given an unsupported operator", async () => {
        expect.assertions(2);

        try {
            await dataProvider(client).getList({
                resource: "post",
                filters: [
                    {
                        field: "id",
                        operator: "containss",
                        value: "80",
                    },
                ],
            });
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err).toHaveProperty(
                "message",
                "\"post.id\" is not a relational field",
            );
        }
    });

});
