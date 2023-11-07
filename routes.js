// This file was added by edgio init.
// You should commit this file to source control.
import { Router, edgioRoutes } from '@edgio/core'
import { redirects } from "./redirects";

export default new Router()
  .always(({ renderWithApp }) => {
    renderWithApp()
  })
  // Here is an example where we cache api/* at the edge but prevent caching in the browser
  // .match('/api/:path*', {
  //   caching: {
  //     max_age: '1d',
  //     stale_while_revalidate: '1h',
  //     bypass_client_cache: true,
  //     service_worker_max_age: '1d',
  //   },
  // })

  // plugin enabling basic Edgio functionality
  .use(edgioRoutes)

  // This loops through the "source" part of the redirects and puts them in a single route that invokes the redirect function
  .if({ path: Object.keys(redirects) }, {
    edge_function: './functions/redirects.js',
  })

  .static('public')

  // Edgio Functions
  .match('/example/edge-database-turso', {
    edge_function: './functions/turso/edge-database-turso.js',
  })
  .match('/example/edge-database-planetscale', {
    edge_function: './functions/edge-database-planetscale.js',
  })
  .match('/', {
    edge_function: './functions/sample-html-page.js',
  })
  .match('/example/generate.json', {
    edge_function: './functions/generate-json.js',
  })
  .match('/example/change-headers.json', {
    edge_function: './functions/change-headers.js',
  })
  .match('/example/manifest-manipulation', {
    edge_function: './functions/manifest-manipulation.js',
  })
  .match('/example/esi', {
    edge_function: './functions/esi.js',
  })
