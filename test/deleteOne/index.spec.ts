import { dataProvider } from "../../src/index";
import client from "../directUsClient";


describe("deleteOne", () => {
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
        console.log(data);
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
        console.log(data);
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
        console.log(data);
        expect(data[0].id).toBe(61);
        expect(data[0].title).toBe("post 61");
        expect(data[0].status).toBe("archived");
        expect(data[1].id).toBe(62);
        expect(data[1].title).toBe("post 62");
        expect(data[1].status).toBe("archived");
    });

    it("softDelete delete many custom", async () => {
        const { data } = await dataProvider(client).deleteOne({
            resource: "post",
            id: "62",
            metaData: {
                softDelete: true,
                status: "deleted",
            },
        });
        console.log(data);
        expect(data.id).toBe(62);
        expect(data.title).toBe("post 62");
        expect(data.status).toBe("deleted");
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
