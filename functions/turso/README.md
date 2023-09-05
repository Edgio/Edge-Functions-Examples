# Using Turso edge database with Edgio
To run this example successfully, you need to create an account with 
[Turso](https://turso.tech/). After you have set up your account and database,
you'll need to get generate a database token using
```
turso db tokens create <database name>
```

Once you have the token, please set the following
[environment variables on your property](https://docs.edg.io/guides/v7/basics/environments#environment-variables):
* `TURSO_URL=libsql://<database name>-<username>.turso.io`
* `TURSO_HOSTNAME=<database name>-<username>.turso.io`
* `TURSO_DB_TOKEN=<token>`

You'll need to redeploy your project after setting the environment variables.
