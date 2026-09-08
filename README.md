# Basic Express Server

A modular CommonJS Express server for Code 401 Lab 2. It demonstrates application-level logging, query validation, JSON error handling, automated tests, and continuous integration.

## Setup

Requirements:

- Node.js 20
- npm

Install the locked dependencies:

```bash
npm ci
```

Create a local `.env` file if one is not already present:

```text
PORT=3000
```

Both `.env` and `node_modules/` are ignored so local configuration and installed packages are not added to source control.

## Usage

Start the application:

```bash
npm start
```

The server listens on `http://localhost:3000` by default. Request a person by providing the required `name` query parameter:

```bash
curl "http://localhost:3000/person?name=Ada"
```

Response:

```json
{
  "name": "Ada"
}
```

## Testing

Run the Jest unit and integration test suite with coverage:

```bash
npm test
```

The suite uses Supertest for HTTP integration tests. It covers unknown routes, unsupported methods, validation failure, successful requests, the response body, and both custom middleware modules.

## API

### `GET /person`

Returns a person object from the required query parameter.

| Query parameter | Required | Description |
| --- | --- | --- |
| `name` | Yes | Name returned by the API |

Successful response — `200 OK`:

```json
{
  "name": "Ada"
}
```

Missing `name` response — `500 Internal Server Error`:

```json
{
  "status": 500,
  "message": "Name is required"
}
```

Unknown route or unsupported method — `404 Not Found`:

```json
{
  "status": 404,
  "message": "Not Found"
}
```

## UML

```mermaid
flowchart TD
    Client[HTTP Client] --> Logger[Logger middleware]
    Logger --> Router{GET /person?}
    Router -->|Yes| Validator{Name supplied?}
    Validator -->|Yes| Person[200 JSON person response]
    Validator -->|No| Error500[500 JSON error handler]
    Router -->|No or unsupported method| Error404[404 JSON handler]
```

## Deployment

- Pull request: [https://github.com/AGiv-lab/basic-express-server/pull/1](https://github.com/AGiv-lab/basic-express-server/pull/1)
- Render deployment: [https://basic-express-server-20xs.onrender.com](https://basic-express-server-20xs.onrender.com)

## Lab 3: Express REST API — Dynamic API Phase 2

This extension adds PostgreSQL persistence through Sequelize and separate Express
routers for instruments and movies. The Lab 2 `/person` endpoint, middleware,
error handlers, and tests remain in place. All modules use CommonJS.

### Database setup

Install dependencies with `npm ci`. Start PostgreSQL and create two databases,
for example `api_server` and `api_server_test`, owned by your database user.
Copy the variables from `.env.example` into your ignored local `.env` and replace
the placeholder username, password, host, port, and database names:

```text
PORT=3000
DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432/api_server
TEST_DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432/api_server_test
```

Use a separate test database. Tests use only `TEST_DATABASE_URL`, create missing
model tables, and remove the records they create. They exercise real Express
endpoints and PostgreSQL persistence; only the database-error test simulates a
failure. The CI workflow supplies its own temporary PostgreSQL service.

`npm start` authenticates the connection and runs `sequelize.sync()` before
starting the existing server. Sync creates missing tables without dropping or
force-resetting existing tables. A failed connection prevents the HTTP server
from starting. Connection settings stay in environment variables, never source
code. See [Sequelize connection documentation](https://sequelize.org/docs/v6/getting-started/#testing-the-connection).

### Models

| Model | Fields |
| --- | --- |
| Instrument | `name: STRING`, `type: STRING`, `brand: STRING` |
| Movie | `title: STRING`, `genre: STRING`, `year: INTEGER` |

Both models receive a database-generated integer `id`. Automatic timestamps are
disabled. No additional model fields or required-field constraints are defined.
POST and PUT explicitly select only the fields above, ignoring supplied IDs and
unknown properties. PUT preserves omitted fields.

### REST routes

Send JSON request bodies with `Content-Type: application/json`.

| Method | Instrument route | Movie route | Successful response |
| --- | --- | --- | --- |
| POST | `/instruments` | `/movies` | `201`: created record including ID |
| GET | `/instruments` | `/movies` | `200`: array of records (empty array if none) |
| GET | `/instruments/:id` | `/movies/:id` | `200`: requested record |
| PUT | `/instruments/:id` | `/movies/:id` | `200`: saved, updated record |
| DELETE | `/instruments/:id` | `/movies/:id` | `204`: no response body |

Example POST bodies:

```json
{ "name": "Stratocaster", "type": "Guitar", "brand": "Fender" }
```

```json
{ "title": "Arrival", "genre": "Science Fiction", "year": 2016 }
```

A created movie response has the same fields plus its generated ID, for example:

```json
{ "id": 1, "title": "Arrival", "genre": "Science Fiction", "year": 2016 }
```

Missing records, invalid IDs, unknown routes, and unsupported methods such as
`PATCH /movies` return the existing `404` JSON response. Database and validation
errors pass to the existing Lab 2 `500` JSON error handler.

Run `npm test` for the full suite, or run each new endpoint suite independently:

```bash
npm test -- --runInBand __tests__/instruments.test.js
npm test -- --runInBand __tests__/movies.test.js
```

### Lab 3 links

- Deployed URL: TODO — add after deployment approval.
- Merged pull request URL: TODO — add after merge approval.

The Lab 2 links above are retained as historical project documentation.
