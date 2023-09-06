// This file was automatically added by edgio init.
// You should commit this file to source control.
// Learn more about this file at https://docs.edg.io/guides/edgio_config

require('dotenv').config();

const TURSO_HOSTNAME = 'peaceful-captain-flint-raeesbhatti.turso.io';
const DUMMY_JSON_HOSTNAME = 'edgio-functions-dummy-json-default.edgio.link';
const UPSTASH_HOSTNAME = 'us1-fitting-ox-38647.upstash.io';
// const PLANETSCALE_HOSTNAME = '';

module.exports = {
  // The name of the site in Edgio to which this app should be deployed.
  name: 'edgio-function-examples',

  // The name of the team in Edgio to which this app should be deployed.
  team: 'edgio-examples',

  origins: [
    {
      // The name of the backend origin
      name: 'dummy-json',

      // When provided, the following value will be sent as the host header when connecting to the origin.
      // If omitted, the host header from the browser will be forwarded to the origin.
      override_host_header: DUMMY_JSON_HOSTNAME,

      // The list of backend hosts
      hosts: [
        {
          // The domain name or IP address of the origin server
          location: DUMMY_JSON_HOSTNAME,
        },
      ],
    },

    {
      name: 'turso',
      override_host_header: TURSO_HOSTNAME,
      hosts: [
        {
          location: TURSO_HOSTNAME,
        },
      ],
      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: TURSO_HOSTNAME,
      },
    },

    // {
    //   name: 'planetscale',
    //   override_host_header: PLANETSCALE_HOSTNAME,
    //   hosts: [
    //     {
    //       location: PLANETSCALE_HOSTNAME,
    //     },
    //   ],
    // },

    {
      // The name of the backend origin
      name: 'upstash',

      // When provided, the following value will be sent as the host header when connecting to the origin.
      // If omitted, the host header from the browser will be forwarded to the origin.
      override_host_header: UPSTASH_HOSTNAME,

      // The list of backend hosts
      hosts: [
        {
          // The domain name or IP address of the origin server
          location: UPSTASH_HOSTNAME,
        },
      ],

      tls_verify: {
        use_sni: true,
        sni_hint_and_strict_san_check: UPSTASH_HOSTNAME,
        allow_self_signed_certs: true,
      },
    },
  ],
};
