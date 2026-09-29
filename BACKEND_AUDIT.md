# Backend audit and cleanup

Audited source: `main` at `8223f79`. Changes are on `fix/backend-logic-cleanup`.

This is a source-code audit and regression-test report. It does not claim that every possible defect is eliminated. Live production data, real GPS, SMTP delivery, and MongoDB transaction/index behavior were not exercised against your deployment.

## Business and security errors found

| # | Error in the audited code | Correction |
| --- | --- | --- |
| 1 | Bin creation, seeding, collection, workflow updates, task reads and truck tracking had no authentication. | All operational routes require a session and an appropriate admin/driver role. |
| 2 | `Admin` actually stored both admins and drivers, obscuring account responsibilities. | Renamed to `User` and `userController`/`userRoutes`; explicitly retained the `admins` MongoDB collection. |
| 3 | Reset-token fields were assigned by the controller but absent from the schema, so ordinary Mongoose saves did not persist them. | Declared the hashed token and expiry fields, hidden by default. |
| 4 | Forgot-password returned the raw reset token to anyone supplying an email, including production; no email was sent. | SMTP delivery in normal operation; raw tokens only when explicitly enabled outside production. Missing delivery configuration fails rather than claiming an email was sent. |
| 5 | Concurrent reset requests could reuse a token because lookup and save were separate. | Single atomic conditional update consumes the unexpired token once. |
| 6 | Password changes did not revoke existing JWT sessions. | Session version is included in JWTs and checked against the account; resets increment it. Existing pre-version cookies work only until the first reset. |
| 7 | Minimum password length was applied to the stored hash, not validated plaintext. | Validate plaintext before hashing; enforce 8 characters and bcrypt's 72-byte ceiling. Existing shorter passwords can still log in. |
| 8 | User creation returned the password hash. Reset fields could also leak from later user reads. | Sensitive schema fields use `select:false`, and account-management responses use an explicit public-field list. |
| 9 | Emails were not normalized or uniquely constrained without regard to case. | Trim/lowercase validation and a case-insensitive unique index; case-insensitive login/reset lookups support legacy casing. |
| 10 | Admins could remove/demote themselves and potentially lock out account management. | Self-removal/demotion rejected; management transactions touch the acting admin to conflict with concurrent cross-removal. Active drivers cannot be deleted or have their role changed mid-trip. |
| 11 | A fresh database had no supported way to create the first admin, since account creation required an admin session. | Added a local `npm run create-admin` bootstrap command. No public signup route. |
| 12 | Invalid IDs, missing passwords, malformed coordinates and duplicate values frequently became generic 500s. `parseFloat` accepted strings such as `19junk`. | Shared validation; 400 for invalid input, 404 for missing entities, 409 for conflicts. Zero coordinates remain valid. |
| 13 | GeoJSON arrays, fill-level ranges and service-location coordinates lacked sufficient model validation. | Validated `[lng, lat]`, geographic ranges and 0–100 fill levels; seed data is bounded, validated and whitelisted. |
| 14 | The location formatter expected GeoJSON, while `Location` stores `lat/lng`. Real destinations were discarded in favour of hard-coded fallbacks. | Read the actual location schema; missing/invalid BMC or dumpyard configuration is explicit. |
| 15 | Configured destinations used database IDs while frontend actions expected `home`/`warehouse`. | Stable action IDs plus separate `locationId` and explicit action `type`. |
| 16 | Pickup eligibility used 70%, while the UI's red/pickup threshold is 75%. | One backend pickup threshold of 75%, aligned with the UI. |
| 17 | Emptying a bin removed it from `pickups`; completion checked *all* bins, including low-fill bins that were never pickups. | Track collected cargo per driver and a fixed eligible-bin snapshot per trip. Picked records remain visible until unloading. |
| 18 | New fills could keep extending a route while it was being collected. | Capture the trip's eligible-bin IDs at its first pickup. Newly eligible bins wait for the next trip. |
| 19 | The API could mark the dumpyard complete without any pickups, remaining-task checks, or cargo ownership. | Explicit idle → collecting → returning → idle transitions; require cargo, completion of that trip's remaining pickups, unloading, then return to BMC. |
| 20 | Task reads overwrote a completed dumpyard with `available`/`locked`, while a shared location status mixed progress between trips. | Completion is derived from the driver's truck/trip state, not global location state. |
| 21 | Every driver read/wrote `Truck.findOne()`, overwriting one shared truck. | One driver-scoped truck with a unique driver index; legacy unassigned records are retained but ignored by driver operations. |
| 22 | Pickup was duplicated in two controllers; concurrent updates could disagree or double-collect. | Both endpoint paths call one transaction-based collection service. Successful pickup/unload retries are idempotent. Concurrent bin claims conflict through MongoDB writes. |
| 23 | No server-side distance check existed; the frontend allowed actions within 50 kilometres. | Require a server-stored location less than two minutes old and within 100 metres. The client obtains a fresh position on action and follows server targets. This validates submitted GPS, not hardware-attested physical presence. |
| 24 | Route order was unsorted and `nextTarget` was merely the first returned pickup. | Nearest-neighbour ordering of eligible bins from the driver's position, falling back to BMC. This is a geographic heuristic, not globally optimal road routing. |
| 25 | Simulation reset collected bins on the next 30-second tick, losing cargo/progress, and could overwrite simultaneous collections. | Preserve undelivered cargo; resume filling only after unloading. Compare-and-set writes prevent stale simulation updates from overwriting collection changes. |
| 26 | Simulation always ran in production and async interval executions could overlap or reject unhandled. | Opt-in simulation, sequential scheduling, error handling and shutdown cleanup. |
| 27 | Deleting bins could erase undelivered cargo. | Conditional deletion preserves undelivered records; bulk-delete responses report how many remain. |
| 28 | Location seeding could insert duplicates or leave partial configuration; changing destinations could disrupt active trips. | Validate the complete batch, transactionally upsert one BMC and one dumpyard, reject changes during active trips and serialize writes with collection actions. |
| 29 | Controller catches leaked internal messages/stack traces; authentication translated database failures into invalid-token responses. | Centralized error handling without client stack traces; database failures remain server errors. |
| 30 | Cookie-authenticated writes had no explicit origin check and auth/reset routes had no request throttling. | Check browser write origins and rate-limit auth/reset attempts. Proxy trust is explicitly configurable. |
| 31 | Startup did not validate secrets or support graceful shutdown; database helpers exited the process themselves. | Centralized configuration validation, transaction-capable topology check, index initialization, nonzero startup failure and shutdown handling. |
| 32 | Driver UI recomputed a conflicting target, signalled unloading before success, and could leave processing stuck after failed requests. | Minimal compatibility updates use server `nextTarget`, show action errors and restore processing state in `finally`; return-to-BMC is supported. |

## File structure and dead code

| Before | After / reason |
| --- | --- |
| `models/Admin.js` | `models/User.js` — both supported account roles; existing database collection preserved |
| `controllers/adminController.js` | `controllers/userController.js` |
| `routes/adminRoutes.js` | `routes/userRoutes.js` — public endpoint paths retained |
| `controllers/workflowController.js` | `controllers/collectionController.js` with shared `services/collectionService.js` |
| `routes/workflowRoutes.js` | `routes/collectionRoutes.js` |
| `lib/ENV.js`, `lib/db.js` | `config/env.js`, `config/database.js` |
| `middlewares/auth.js` | `middleware/auth.js`; error handling in `middleware/errorHandler.js` |
| `utility/mapper.js`, `utility/locationFormatter.js` | Consolidated into `utils/collectionState.js` with the task-state rules |
| `simulation/binFilling.js` | `jobs/binFillSimulator.js` — opt-in background job |
| `models/Delivery.js` | Removed: unused, with a reference to a nonexistent `Pickup` model |
| `models/History.js` | Removed: no imports or callers |

Removed duplicated pickup implementation, obsolete global location status and per-controller error boilerplate. No live database collections or records were dropped. Existing API operations were retained rather than treating unused-in-UI endpoints as disposable.

All pre-existing backend packages are used after the earlier dependency cleanup. Two purposeful runtime dependencies were added: `nodemailer` for actual reset email delivery and `express-rate-limit` for bounded auth throttling. The goal is less dead/duplicate code, not removing required functionality to minimize byte count.

## Setup and migration before merging/deploying

1. Run `npm ci` inside `server` and use Node.js 22.12 or later.
2. Copy `server/.env.example` to `.env`. Set a random `JWT_SECRET` of at least 32 characters and your actual frontend origin in `CLIENT_URL`.
3. Use MongoDB Atlas or a replica set, including for local development. Multi-document collection and account-management transactions intentionally require it. Standalone MongoDB now fails startup with an actionable message. Transaction behavior is not covered by the mocked tests.
4. Startup builds a case-insensitive unique email index. If existing emails differ only by case, resolve those duplicate accounts intentionally before starting this branch. No automatic account deletion or consolidation is performed. Existing accounts remain in `admins`.
5. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `MAIL_FROM`, and provider credentials when required. Production requires an HTTPS frontend. `EXPOSE_RESET_TOKEN=true` is only for local development and is rejected in production.
6. Leave `SIMULATE_BINS=false` for real operational data. Set it to `true` only when you want simulated fill updates.
7. For a fresh database, set `BOOTSTRAP_ADMIN_PASSWORD` in your local environment, run `npm run create-admin`, answer the name/email prompts, then remove that environment variable. Existing admin installations do not need this command.
8. Ensure BMC and dumpyard documents have valid `lat/lng`. The existing admin-only `POST /api/seed/locations` accepts an array of `{ "type": "bmc" | "dumpyard", "name": "...", "lat": number, "lng": number }`. It updates existing records by type. No default destination is invented when configuration is missing.
9. Set `TRUST_PROXY_HOPS` only to your deployment's known trusted proxy count; leave it at zero locally. The included rate-limit store is per process; distributed deployments need a shared store.
10. Existing unassigned truck records and previously collected bins have no reliable driver/trip history. They are not retroactively assigned. Configure/verify destinations and begin a fresh trip after deployment; back up and review existing operational data before cutover.

## Verification

- 20 backend tests: authorization, input/schema validation, coordinate boundaries, trip snapshot, cargo ownership, lifecycle transitions, retry handling, reset-token consumption/session revocation and simulation write conditions.
- 7 frontend tests and production frontend build pass.
- Focused lint checks for changed frontend code pass.
- Tests stub database methods where needed. They do not verify real MongoDB concurrency/rollback/index migrations, SMTP delivery, deployment proxy settings, browser flows, or physical GPS accuracy.
- Existing unrelated frontend CSS build warnings remain (`--bg` and a missing `image.png` reference).
