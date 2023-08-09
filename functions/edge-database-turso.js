import { URL, URLSearchParams } from 'whatwg-url';
global.URL = URL;
global.URLSearchParams = URLSearchParams;
import { createClient } from "@libsql/client/web";

export async function handleHttpRequest(request, context) {
  const client = createClient({
    url: "libsql://peaceful-captain-flint-raeesbhatti.turso.io",
  });

  const result = await client.execute("SELECT 1 AS one");
  context.respondWith(new Response(JSON.stringify(result)));
}
