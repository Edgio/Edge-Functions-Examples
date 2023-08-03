export async function handleHttpRequest(request, context) {
  const content = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <title>Hello Edgio!</title>
            <style>html{font-family:sans-serif}</style>
        </head>
        <body>
          <h1>Salutations from Edgio Functions!</h1>
          <p>This is a sample HTML page.</p>
        </body>
      </html>`;

  const response = new Response(content, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });

  content.respondWith(response);
}
