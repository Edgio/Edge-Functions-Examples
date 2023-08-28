import { URL, URLSearchParams } from 'whatwg-url';
import hasOwn from 'core-js/internals/has-own-property';

// const TURSO_URL = ""
// const AUTH_TOKEN = ""

Object.defineProperty(Object.prototype, 'hasOwn', { value: hasOwn });
global.URL = URL;
global.URLSearchParams = URLSearchParams;
import { createClient } from "@libsql/client/http";

const tursoFetch = function (...args) {
  const [url, options, ...rest] = args;
  return fetch(url, { ...options, edgio: { origin: 'turso' } }, ...rest)
}

const client = createClient({
  fetch: tursoFetch,
  url: TURSO_URL,
  authToken: AUTH_TOKEN,
});

export async function handleHttpRequest(request, context) {
  const result = await client.execute("select * from users")
  const response = new Response(JSON.stringify(result), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
  });

  context.respondWith(response);
}
