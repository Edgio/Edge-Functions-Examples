import { connect } from '@planetscale/database'

// polyfills
import '../polyfills/Buffer'
import '../polyfills/URL'
import createFetch from '../polyfills/fetch'

// const PLANETSCALE_USERNAME = ""
// const PLANETSCALE_PASSWORD = ""

export async function handleHttpRequest(request, context) {
  const config = {
    host: 'aws.connect.psdb.cloud',
    username: PLANETSCALE_USERNAME,
    password: PLANETSCALE_PASSWORD,
    fetch: createFetch('planetscale'),
  }

  const conn = connect(config)

  const results = await conn.transaction(async (tx) => {
    return await tx.execute('SELECT * FROM greeting_table;')
  })

  const content = JSON.stringify({
    message: `${JSON.stringify(results.rows)}`,
  })

  const response = new Response(content, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
  })

  return response
}
