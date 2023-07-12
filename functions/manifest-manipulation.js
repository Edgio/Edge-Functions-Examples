export default function init() {
  addEventListener("fetch", async (event) => {
    const url = event.request.url;
    console.log('url', url);
    const upstreamResponse = await fetch(`${url.origin}/assets/tears-of-steel.m3u`, {
      edgio: {
        origin: 'edgio_static'
      }
    });
    const manifestBody = await upstreamResponse.text();
    const lines = manifestBody.split('\n')
    const highestResolutionLineIndex = lines.findIndex(line => line.includes('1680x750'))
    if (highestResolutionLineIndex === -1) {
      return event.respondWith(upstreamResponse);
    }

    delete lines[highestResolutionLineIndex];
    delete lines[highestResolutionLineIndex + 1];

    const modifiedResponse = new Response(lines.join('\n'), {
      headers: { 'content-type': upstreamResponse.headers.get('content-type') }
    });
    event.respondWith(modifiedResponse);
  });
}
