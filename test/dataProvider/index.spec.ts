import { dataProvider, ManyItems, ID } from "../../src/index";
import client, { url } from "../directUsClient";

const clearAllPosts = async () => {
    const res: ManyItems<any> = await client.items('post').readByQuery({ fields: ['id'] });
    const ids: ID[] = res?.data?.map(item => item?.id || 0 as ID) || [];
    await client.items('post').deleteMany(ids);
}

describe("create", () => {
    beforeAll(async () => {
        await clearAllPosts();
    });
    it("correct response with metaData", async () => {
        const { data } = await dataProvider(client).create({
            resource: "post",
            variables: {
                id: "1",
                title: "Lorem ipsum dolor",
            },
        });
        expect(data.title).toEqual("Lorem ipsum dolor");
        expect(data.id).toBeTruthy();
    });

    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            const { data } = await dataProvider(client).create({
                resource: "post",
                variables: {
                    id: "1",
                    title: "Lorem ipsum dolor",
                },
            });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty(
                "message",
                "Field \"id\" has to be unique.",
            );
        }
    });
});



describe("createMany", () => {
    beforeAll(async () => {
        await clearAllPosts();
    });
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


describe("getApiUrl", () => {
    it("get Url", async () => {
        const actualUrl = await dataProvider(client).getApiUrl();
        expect(actualUrl).toBe(url);
    });
});


describe("get One", () => {
    beforeAll(async () => {
        await clearAllPosts();
        await client.items('post').createOne({
            id: "2",
            title: "Lorem ipsum dolor",
        });
    });
    it("correct response with metaData", async () => {
        const { data } = await dataProvider(client).getOne({
            resource: "post",
            id: "2",
        });

        expect(data.id).toEqual(2);
        expect(data.title).toEqual("Lorem ipsum dolor");
    });

    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            await dataProvider(client).getOne({
                resource: "unknown",
                id: "2",
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




describe("getList", () => {
    beforeAll(async () => {
        await clearAllPosts();
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
    it("correct without meta", async () => {
        const res = await dataProvider(client).getList({
            resource: "post", metaData: { meta: undefined }
        });
        expect(res.data).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 80, title: "Test 1" }),
            expect.objectContaining({ id: 82, title: "not this" }),
            expect.objectContaining({ id: 81, title: "Test 2" }),
        ]))
        expect(res.total).toBe(undefined);
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



describe("getMany", () => {
    beforeAll(async () => {
        await clearAllPosts();
        await client.items('post').createMany([
            {
                id: "99",
                title: "post 99",
            },
            {
                id: "98",
                title: "post 98",
            },
            {
                id: "82",
                title: "not this",
            },
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



describe("update", () => {
    beforeAll(async () => {
        await clearAllPosts();
        await client.items('post').createMany([
            {
                id: "3",
                title: "Test 1",
            }

        ]);
    });
    it("correct response", async () => {
        const { data } = await dataProvider(client).update({
            resource: "post",
            id: "3",
            variables: {
                title: "Updated Title",
                status: "published",
            },
        });

        expect(data.id).toEqual(3);
        expect(data.title).toEqual("Updated Title");
        expect(data.status).toEqual("published");
    });

    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            await dataProvider(client).update({
                resource: "unknown",
                id: "3",
                variables: {
                    title: "Updated Title",
                    status: "published",
                },
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


describe("updateMany", () => {
    beforeAll(async () => {
        await clearAllPosts();
        await client.items('post').createMany([
            {
                id: "2",
                title: "Test 1",
            },
            {
                id: "3",
                title: "Test 2",
            },
            {
                id: "82",
                title: "not this",
            },
        ]);
    });
    it("correct response with metaData", async () => {
        const { data } = await dataProvider(client).updateMany({
            resource: "post",
            ids: ["2", "3"],
            variables: {
                title: "Batch updated content",
            },
        });
        expect(data[0].id).toEqual(2);
        expect(data[0].title).toEqual("Batch updated content");

        expect(data[1].id).toEqual(3);
        expect(data[1].title).toEqual("Batch updated content");
    });

    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            await dataProvider(client).updateMany({
                resource: "unknown",
                ids: ["2", "3"],
                variables: {
                    title: "Batch updated content",
                },
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


describe("delete", () => {
    beforeAll(async () => {
        const res = await client.items('post').createMany([{
            id: '60',
            title: 'post 60',
        }, {
            id: '61',
            title: 'post 61',
        },
        {
            id: '62',
            title: 'post 62',
        }
        ]);
    });

    // soft delete
    it("softDelete delete one default", async () => {
        const { data } = await dataProvider(client).deleteOne({
            resource: "post",
            id: "62",
            metaData: {
                softDelete: true,
            },
        });

        expect(data.id).toBe(62);
        expect(data.title).toBe("post 62");
        expect(data.status).toBe("archived");
    });

    it("softDelete delete one custom", async () => {
        const { data } = await dataProvider(client).deleteOne({
            resource: "post",
            id: "62",
            metaData: {
                softDelete: true,
                status: "deleted",
            },
        });

        expect(data.id).toBe(62);
        expect(data.title).toBe("post 62");
        expect(data.status).toBe("deleted");
    });

    it("softDelete delete many default", async () => {
        const { data } = await dataProvider(client).deleteMany({
            resource: "post",
            ids: ["62", "61"],
            metaData: {
                softDelete: true,
            },
        });

        expect(data[0].id).toBe(61);
        expect(data[0].title).toBe("post 61");
        expect(data[0].status).toBe("archived");
        expect(data[1].id).toBe(62);
        expect(data[1].title).toBe("post 62");
        expect(data[1].status).toBe("archived");
    });

    it("softDelete delete many custom", async () => {
        const { data } = await dataProvider(client).deleteMany({
            resource: "post",
            ids: ["62", "61"],
            metaData: {
                softDelete: true,
                status: "deleted",
            },
        });
        expect(data[0].id).toBe(61);
        expect(data[0].title).toBe("post 61");
        expect(data[0].status).toBe("deleted");
        expect(data[1].id).toBe(62);
        expect(data[1].title).toBe("post 62");
        expect(data[1].status).toBe("deleted");
    });

    // hard delete
    it("correct response with metaData", async () => {
        const { data } = await dataProvider(client).deleteOne({
            resource: "post",
            id: "60",
        });
        expect(data).toBe(undefined);
    });
    it("correct response with metaData", async () => {
        const { data } = await dataProvider(client).deleteMany({
            resource: "post",
            ids: ["61"],
        });
        expect(data).toBe(undefined);
    });

    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            await dataProvider(client).deleteOne({
                resource: "unknown",
                id: "987",
            });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty(
                "message",
                "You don't have permission to access this.",
            );
        }
    });
    it("throw error as id dont exists ", async () => {
        expect.assertions(2);
        try {
            await dataProvider(client).deleteMany({
                resource: "unknown",
                ids: ["987"],
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

describe("custom", () => {
    beforeAll(async () => {
        await clearAllPosts();
    });

    it("custom post action", async () => {
        const response = await dataProvider(client).custom!({
            url: "items/post",
            method: "post",
            payload: {
                id: "1",
                title: "Test 1",
            },
        });

        expect(response.data.id).toBe(1);
        expect(response.data.title).toBe("Test 1");
        expect(response.data.status).toBe("draft");
        expect(response.data.date_created).toBeTruthy();
        expect(response.data.user_created).toBeTruthy();
        expect(response.data.date_updated).toBeNull();
        expect(response.data.user_updated).toBeNull();
    });

    it("custom patch action", async () => {
        const response = await dataProvider(client).custom!({
            url: "items/post/1",
            method: "patch",
            payload: {

                status: "published",

            },
        });

        expect(response.data.id).toBe(1);
        expect(response.data.title).toBe("Test 1");
        expect(response.data.status).toBe("published");
        expect(response.data.date_created).toBeTruthy();
        expect(response.data.user_created).toBeTruthy();
        expect(response.data.date_updated).toBeTruthy();
        expect(response.data.user_updated).toBeTruthy();
    });

    it("get action", async () => {
        const response = await dataProvider(client).custom!({
            url: "items/post/1",
            method: "get",
            payload: {
                status: "published",
            },
        });

        expect(response.data.id).toBe(1);
        expect(response.data.title).toBe("Test 1");
        expect(response.data.status).toBe("published");
        expect(response.data.date_created).toBeTruthy();
        expect(response.data.user_created).toBeTruthy();
        expect(response.data.date_updated).toBeTruthy();
        expect(response.data.user_updated).toBeTruthy();
    });

    it("delete action", async () => {
        const response = await dataProvider(client).custom!({
            url: "items/post/1",
            method: "delete",
            payload: {
                status: "published",
            },
        });
        expect(response.data).toBe(undefined);
    });


    // TODO: test custom action for put with nock
});