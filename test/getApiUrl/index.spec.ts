import { dataProvider } from "../../src/index";
import client, { url } from "../directUsClient";

describe("getApiUrl", () => {
    it("get Url", async () => {
        const actualUrl = await dataProvider(client).getApiUrl();
        expect(actualUrl).toBe(url);
    });
});