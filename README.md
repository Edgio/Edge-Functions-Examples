# Edge Functions Examples

## Description

This repository provides example code for implementing the most common use cases on Edge Functions. It features examples of how to add headers to a request, change response bodies before returning them to the client, create HTML pages from scratch to return as a response, manipulate video player manifests, and generate JSON from scratch.

## Prerequisites

To use this project, you must be an Edgio customer and signed up for the Edge Functions. The system requirements include Node.js v16 or higher, and a UNIX-like system (Linux or macOS). The project code is written in JavaScript.

## Setup and Installation

1. Ensure you meet the prerequisites.
2. Clone the repository to your local machine.
3. Run `npm install` in the repository directory.

```bash
npm i
```

## Getting Started

After setting up the project, run `npm run edgio dev` to start a local development server to test the example functions.

```bash
npm run edgio dev
```

To deploy the project to Edgio, use the command `npm run edgio deploy`. Note that deployment to Edgio requires you to be logged into Edgio CLI which can be done via `npm run edgio login` and following the instructions.

```bash
npm run edgio deploy
```

Start the React frontend by running `npm run dev`.

```bash
npm run dev
```

Edge Functions must be enabled for your team, which can be done by contacting your account manager at Edgio and signing up for the Edge Functions.

## Known Issues and Limitations

Currently

* We only support JavaScript-based code
* Each request has a 60-second (wall time) timeout limit
* Each request is limited to 50ms of CPU time
* Each request is limited to 2MB of memory
* An Edgio Function can make fetch requests only to origins defined in your property configuration
  file (`edgio.config.js`).

We're looking forward to feedback from our customers about these limitations and how we can improve the product.

## Support

If you have any queries or face issues with this project, please don't hesitate to contact
the [Edgio team](https://edg.io/contact-support/).

## License

[Creative Commons Attribution 4.0 International Public License](LICENSE-CONTENT) for the documentation.

[MIT License](LICENSE-CODE) for the code.

## Turso

### Install Turso CLI and Create Account

If you're on MacOS you can install the CLI with Homebrew:

```bash
brew install chiselstrike/tap/turso
turso auth signup
```

### Create Database and Generate Token

```bash
turso db create my-db
turso db tokens create my-db
```

Set your token and URL variables in `functions/edge-database-turso.js`.

```js
const TURSO_URL = ""
const AUTH_TOKEN = ""
```

### Seed Database

```bash
turso db shell my-db
```

```sql
create table users (id text, email text);
insert into users values ("001", "first@foo.com");
insert into users values ("002", "second@foo.com");
select * from users;
.quit
```

### Set Host Header

Set `HOST_HEADER` environment variable with your Turso domain.

```bash
HOST_HEADER=""
```

## PlanetScale

### Install PlanetScale CLI and Create Account

```bash
brew install planetscale/tap/pscale

# Check your `pscale` version
pscale version

# Authenticate with your PlanetScale account
pscale auth login
```

### Create a PlanetScale Database

```bash
pscale database create edgio-mysql --region us-west
```

### Connect to PlanetScale Database

```bash
pscale shell edgio-mysql main
```

Create a new table called `greeting_table` with a single `text` column called `Greeting`.

```sql
CREATE TABLE greeting_table (
  greeting text,
  id int not null auto_increment,
  primary key (id)
);
```

Insert two rows into the table.

```sql
INSERT INTO greeting_table (greeting) VALUES ('Hello'), ('Goodbye');
```

Return the list of available tables.

```sql
show tables;
```

Return all the data in the `greeting_table` table.

```sql
SELECT * FROM greeting_table;
```

```
+---------+----+
| greeting    | id |
+---------+----+
| Hello   |  1 |
| Goodbye |  2 |
+---------+----+
```

### Create a Password for PlanetScale Database

Promote branch to production:

```bash
pscale branch promote edgio-mysql main
```

Create password:

```bash
pscale password create edgio-mysql main mypass
```

```bash
mysql -h aws.connect.psdb.cloud \
  -u USERNAME \
  -pPASSWORD \
  --ssl-mode=VERIFY_IDENTITY \
  --ssl-ca=/etc/ssl/cert.pem
```

```sql
SELECT * FROM greeting_table;
```