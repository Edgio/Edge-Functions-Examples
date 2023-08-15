import { URL, URLSearchParams } from 'whatwg-url';
import hasOwn from 'core-js/internals/has-own-property';

Object.defineProperty(Object.__proto__, 'hasOwn', { value: hasOwn });
global.URL = URL;
global.URLSearchParams = URLSearchParams;
import { createClient } from "@libsql/client/http";

const tursoFetch = function (...args) {
  const [url, options, ...rest] = args;
  return fetch(url, { ...options, edgio: { origin: 'turso' } }, ...rest)
}

export async function handleHttpRequest(request, context) {
  const client = createClient({
    fetch: tursoFetch,
    url: "libsql://peaceful-captain-flint-raeesbhatti.turso.io",
  });

  const result = await client.execute("SELECT 1 AS one");
  context.respondWith(new Response(JSON.stringify(result)));
}
