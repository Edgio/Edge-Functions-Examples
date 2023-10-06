import { redirects } from "../redirects";
import { URL } from 'whatwg-url'

export function handleHttpRequest(request, context) {
  const url = new URL(request.url)

  if (!redirects[url.pathname]) {
    return new Response("Not found", { status: 404 });
  }

  return new Response("", { status: 301, headers: { location: redirects[url.pathname] } });
}
