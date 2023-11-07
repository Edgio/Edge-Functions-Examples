// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config

// const TURSO_HOST_HEADER = ""
// const PLANETSCALE_HOST_HEADER = ""

module.exports = {
  connector: '@edgio/nodejs-connector',
  // The name of the site in Edgio to which this app should be deployed.
  name: "edgio-functions-examples",

  // The name of the team in Edgio to which this app should be deployed.
  // team: 'edge-functions-sandbox',

  cloudRuntime: 'nodejs18.x',
  nodejsConnector: {
    'buildFolder': 'src',
    "entryFile": "app.js",
    "envPort": "PORT",
    "buildCommand": "",
    "devCommand": "npm run dev:express",
    "devReadyMessageOrTimeout": 5,
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
        },
      ],
    },

    {
      name: 'turso',
      override_host_header: process.env.TURSO_HOSTNAME,
      hosts: [
        {
          location: process.env.TURSO_HOSTNAME,
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: process.env.TURSO_HOSTNAME,
      }
    },

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
