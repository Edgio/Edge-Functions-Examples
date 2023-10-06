import { redirects } from "../redirects";
import { URL } from 'whatwg-url'

export function handleHttpRequest(request, context) {
  const url = new URL(request.url)

  if (!redirects[url.pathname]) {
    return new Response("Not found", { status: 404 });
  }

  return Response.redirect(redirects[url.pathname], 301);
}
