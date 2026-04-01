# A simple fastify application server

This is a simple file-based routing fastify 5 application skeleton for JSON API server with some pre-defined features.

Main entry file: `src/index.mjs` is the only core file.
Target: Node.js 22+

RUN TESTS AFTER ANY CHANGE TO SEE IF IT BROKE ANYTHING.

## Testing

- Run `npm test` to execute the real HTTP integration suite.
- The tests boot the scaffold from `fixtures/scaffold/` and hit routes with `fetch()`.

## Updating tests

- Edit `test/fastify-app.test.mjs` for assertions and new cases.
- Add or adjust fixture routes under `fixtures/scaffold/app/` to mirror the consuming project layout.
- Keep fixtures outside `test/`; Node's test runner will treat `.js`/`.mjs` files under `test/` as tests.
- Keep the test app as close to the production scaffold as possible; avoid changing it casually, or breaking changes may slip through unnoticed.
- Only update the test app when adding a new feature or a new config branch that must be covered, and make sure existing behavior still passes.
- The test app should continue to represent how the scaffold behaves in production, so framework upgrades do not make the test fixture fail on its own.