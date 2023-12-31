import { URL } from 'whatwg-url'
import { DOMParser } from 'xmldom'

export async function handleHttpRequest(request, context) {
  const reqUrl = new URL(request.url)
  const templateResponse = await fetch(`${reqUrl.origin}/index.html`, {
    edgio: { origin: 's3-test' },
    redirect: 'manual',
  });
  if (!templateResponse.ok) {
    return new Response(JSON.stringify({
      status: templateResponse.status,
      statusText: templateResponse.statusText,
      location: templateResponse.headers.get('location')
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }

  const templateText = await templateResponse.text()

  // Parse the response
  const parser = new DOMParser()
  const htmlDoc = parser.parseFromString(templateText, 'text/html')
  const esiTags = htmlDoc.getElementsByTagName('esi:include')
  if (esiTags.length > 0) {
    const esi = esiTags[0];
    // Replace the esi:include tag with the contents of the file
    const jsonSrcUrl = `${esi.getAttribute('src')}`
    const cartData = await fetch(jsonSrcUrl, {
      edgio: { origin: 's3-test' }
    })
    const cartDataJson = await cartData.text()
    const replacementString = `
        <div id="content">
            <div>I am a page with replaced ESI tage! The folllwing content is coming from an ESI source</div>
            <pre>${cartDataJson}</pre>
        </div>
    `
    const replacementHtml = parser.parseFromString(replacementString, 'text/html')

    esi.parentNode.replaceChild(replacementHtml, esi)
  }

  return new Response(htmlDoc, {
    headers: {
      'content-type': 'text/html'
    }
  })
}
