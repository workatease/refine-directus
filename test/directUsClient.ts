import { Directus } from "@directus/sdk";

const url = "https://h2cwcduj.directus.app/"
const directus = new Directus(url, { auth: { staticToken: 'sF2hHnMacG4qigKctYJ12pg2PrHocmz5' } });

const noAuthDirectus = new Directus(url);

export { url, noAuthDirectus };
export default directus;
