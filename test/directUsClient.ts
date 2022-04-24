import { Directus } from "@directus/sdk";

const url = "https://2befv7yw.directus.app/"
const directus = new Directus(url, { auth: { staticToken: 'QUM5T15SdxPtzJPch04Qg76TQIXpFBIM' } });

const noAuthDirectus = new Directus(url);

export { url, noAuthDirectus };
export default directus;
