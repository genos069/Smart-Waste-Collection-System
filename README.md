# Smart Waste Collection System

## Run locally

Use Node.js 22.12+ (or a newer supported LTS release).

1. In `server`, run `npm ci` and copy `.env.example` to `.env`. Set `DB_URL` to a MongoDB replica set or Atlas, `JWT_SECRET` to a random secret of at least 32 characters, and `CLIENT_URL` to your frontend origin. Then run `npm run dev`.
2. In `client`, run `npm ci`. Set `VITE_API_URL=http://localhost:4000/api` in `.env`, then run `npm run dev`.

`VITE_API_URL` accepts a backend origin or a URL ending in `/api`, with or without a trailing slash. Restart Vite after changing it. For deployment, set it to your backend URL and set the backend's `CLIENT_URL` to the exact frontend origin; requests use authentication cookies.

## Backend routes

`server/src/app.js` configures middleware and mounts `routes/index.js` at `/api`. `server.js` starts the database connection, simulation and HTTP listener. Route modules import feature controllers; authentication middleware lives in `middleware/auth.js`.

Existing endpoint paths are retained. Bin/user/location management requires an admin; task/location/collection operations require a driver:

| Module | Endpoints (all prefixed by `/api`) |
| --- | --- |
| authRoutes | POST `/login`, `/logout`, `/forgot-password`, `/reset-password`; GET `/me` |
| userRoutes | POST `/createAdmins`; GET `/allAdmins`, `/adminsById/:id`; PUT `/updateAdmin/:id`; DELETE `/deleteAdmin/:id` |
| binRoutes | POST `/pickups`, `/seed/bins`; GET `/allBins`; DELETE `/deleteBin/:id`, `/deleteAllBins` |
| taskRoutes | GET `/tasks` |
| truckRoutes | POST `/location` |
| locationRoutes | POST `/seed/locations` |
| collectionRoutes | POST `/update-status`, `/collect-bin` |
| index | GET `/health` |

## Frontend services

`client/src/services/api.js` owns base URL normalization, cookies, JSON parsing and HTTP errors. Feature services (`authService`, `adminService`, `binService`, `taskService`, `truckService`, `locationService`, `workflowService`) own endpoint paths and return parsed data. Pages/components call services; they do not call `fetch` or parse Response objects. OSRM requests live in `routingService.js`; route formatting remains in `utils/routing.js`.

## Checks

- `cd server` then `npm test`: HTTP route wiring, auth protection and error handling, using mocked models without MongoDB.
- `cd client` then `npm test`: service URLs, authentication cookies, request bodies and error handling.
- `cd client` then `npm run build`: production frontend build.

The HTTP tests do not replace integration testing with a configured MongoDB and real login session.

## Redesigned admin pages

The five admin pages use the layout and animations from the supplied redesign ZIP, adapted to the existing routes:

| Page | Route | Data / actions |
| --- | --- | --- |
| Overview | `/admin-dashboard` | Live bin counts, fill averages, priority queue, Leaflet map, current user and logout |
| Bin management | `/all-bins` | Search, status filter, selection, individual/bulk/all deletion |
| Add a smart bin | `/admin-map` | Click the real map or enter coordinates; save through the bin service |
| Team access | `/user-list` | Saved users, real roles and timestamps, search and removal |
| Add a team member | `/create-users` | Create an `admin` or `driver` account |

Bin screens normalize MongoDB `_id`, `fillLevel`, and GeoJSON `[longitude, latitude]` through `utils/adminData.js`. Pickup priority starts at 75%; 50–74% is filling. Counts and averages handle empty inventories. The overview and bin list refresh every 15 seconds, and mutation screens refresh after saves/deletions. Loading, error, retry, empty and pending-action states are included.

The demo's unsupported districts, dispatch actions, online-driver counts, historical trends, and device-pairing promises were replaced with available data/actions. User timestamps show creation/update times rather than invented last-active times. Styling is scoped under `.admin-redesign` so public/login/driver pages retain their styles. The existing `/me` cookie endpoint restores sessions after page refresh.

## Backend cleanup and migration

Read [BACKEND_AUDIT.md](BACKEND_AUDIT.md) for the complete findings, renamed/deleted files, changed business rules, required setup, and verification limits. Simulation now runs only with `SIMULATE_BINS=true`. Production password resets require SMTP. Account data remains in the existing MongoDB `admins` collection.
