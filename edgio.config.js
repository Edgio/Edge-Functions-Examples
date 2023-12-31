const path = require('path');
// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config

// const TURSO_HOST_HEADER = ""
// const PLANETSCALE_HOST_HEADER = ""

module.exports = {
  connector: '@edgio/express',
  // The name of the site in Edgio to which this app should be deployed.
  name: "edgio-functions-examples",

  // The name of the team in Edgio to which this app should be deployed.
  // team: 'edge-functions-sandbox',

  cloudRuntime: 'nodejs18.x',
  express: {
    appPath: './src/app.js',
  },

  origins: [
    {
      // The name of the backend origin
      name: 'dummy-json',

      // When provided, the following value will be sent as the host header when connecting to the origin.
      // If omitted, the host header from the browser will be forwarded to the origin.
      override_host_header: 'edgio-functions-dummy-json-default.edgio.link',

      // The list of backend hosts
      hosts: [
        {
          location: [
            { hostname: 'edgio-functions-dummy-json-default.edgio.link', port: 443 }
          ],
          scheme: 'https',
        },
      ],
    },
    {
      // The name of the backend origin
      name: 's3-test',

      // When provided, the following value will be sent as the host header when connecting to the origin.
      // If omitted, the host header from the browser will be forwarded to the origin.
      override_host_header: 'edgio-test-origin.s3.amazonaws.com',

      // The list of backend hosts
      hosts: [
        {
          location: [
            { hostname: 'edgio-test-origin.s3.amazonaws.com', port: 443 }
          ],
          scheme: 'https',
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: 'edgio-test-origin.s3.amazonaws.com',
      }
    },
    //
    // {
    //   name: 'turso',
    //   override_host_header: process.env.TURSO_HOSTNAME,
    //   hosts: [
    //     {
    //       location: process.env.TURSO_HOSTNAME,
    //     },
    //   ],
    //   tls_verify: {
    //     use_sni: true,
    //     sni_hint_and_strict_san_check: process.env.TURSO_HOSTNAME,
    //   }
    // },
    //
    // {
    //   name: 'planetscale',
    //   override_host_header: PLANETSCALE_HOST_HEADER,
    //   hosts: [
    //     {
    //       location: PLANETSCALE_HOST_HEADER,
    //     },
    //   ],
    // },
  ],
};
