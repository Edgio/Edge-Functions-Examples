// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config

require('dotenv').config();

// const TURSO_HOST_HEADER = ""
// const PLANETSCALE_HOST_HEADER = ""
const DUMMY_JSON_HEADER = 'edgio-functions-dummy-json-default.edgio.link';
const UPSTASH_HOST = 'us1-fitting-ox-38647.upstash.io';

module.exports = {
  // The name of the site in Edgio to which this app should be deployed.
  name: 'edgio-functions-examples',

  // The name of the team in Edgio to which this app should be deployed.
  // team: 'edge-functions-sandbox',

  origins: [
    {
      // The name of the backend origin
      name: 'dummy-json',

      // When provided, the following value will be sent as the host header when connecting to the origin.
      // If omitted, the host header from the browser will be forwarded to the origin.
      override_host_header: DUMMY_JSON_HEADER,

      // The list of backend hosts
      hosts: [
        {
          // The domain name or IP address of the origin server
          location: DUMMY_JSON_HEADER,
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
      },
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

    {
      // The name of the backend origin
      name: 'upstash',

      // When provided, the following value will be sent as the host header when connecting to the origin.
      // If omitted, the host header from the browser will be forwarded to the origin.
      override_host_header: UPSTASH_HOST,

      // The list of backend hosts
      hosts: [
        {
          // The domain name or IP address of the origin server
          location: UPSTASH_HOST,
        },
      ],

      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: UPSTASH_HOST,
        allow_self_signed_certs: true,
      },
    },
  ],
};
