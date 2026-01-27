import type { APIContext } from "astro";
import { GET as atomGET } from "./atom.xml";

export async function GET(context: APIContext) {
	return atomGET(context);
}
