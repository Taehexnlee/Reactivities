# Reactivities

Reactivities is a full-stack social events platform built with **ASP.NET Core 8**, **Entity Framework Core**, **MediatR**, and a **React 19 + Vite** client. Users can browse and join activities, chat in real time via **SignalR**, upload photos to **Cloudinary**, and receive email confirmations sent by **Resend**. The repository is organised as a clean architecture solution with separate Domain, Application, Infrastructure, Persistence, API, and client layers.

---

## Highlights
- **Clean architecture**: Domain models, CQRS-style Application handlers, Persistence via EF Core, and Infrastructure adapters (Cloudinary, Resend, security helpers).
- **Identity + email confirmation**: ASP.NET Core Identity with token-based auth served through `MapIdentityApi`. Email confirmations are sent through Resend before a user can sign in.
- **Real-time collaboration**: Live comment feed per activity powered by SignalR hubs, consumed by the React client through @microsoft/signalr.
- **Modern React client**: Vite + SWC, React Router 7, MobX stores, React Hook Form, TanStack Query, MUI, Leaflet mapping, and reusable UI primitives.
- **Developer ergonomics**: Dockerised SQL Server for local development, HTTPS-ready dev servers via `mkcert`, and single `npm run build` flow that publishes the SPA straight into `API/wwwroot`.

---

## Repository Layout
```
Reactivities/
├─ API/                # ASP.NET Core API project (controllers, SignalR hubs, middleware)
├─ Application/        # MediatR handlers, DTOs, mapping profiles, validation, interfaces
├─ Domain/             # Aggregate roots (Activity, User, Photos, Comments, Followers, etc.)
├─ Infrastructure/     # Cloudinary + Resend integrations, auth helpers
├─ Persistence/        # EF Core DbContext, migrations, seed data
├─ client/             # React + Vite frontend (MobX stores, features, hooks)
├─ docker-compose.yml  # SQL Server 2022 dev container (port 1434)
└─ Reactivities.sln    # Solution file wiring the .NET projects
```

---

## Prerequisites
- **.NET SDK 8.x** and the `dotnet-ef` tool (for migrations).
- **Node.js 20 LTS** (18+ works) with npm.
- **Docker Desktop** (optional) if you want to run SQL Server via `docker compose`.
- **mkcert** so the Vite dev server can run on HTTPS and share cookies with the API.
- Accounts/keys:
  - **SQL Server** credentials (dev defaults provided).
  - **Cloudinary** account for photo uploads.
  - **Resend** API token for outbound email.

---

## Environment Configuration

### API (`API/appsettings.Development.json` or user secrets)
Fill in the required settings locally, preferably via [Secret Manager](https://learn.microsoft.com/aspnet/core/security/app-secrets):

```jsonc
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1434;Database=Reactivities;User Id=sa;Password=Password@1;TrustServerCertificate=True"
  },
  "CloudinarySettings": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  },
  "Resend": {
    "ApiToken": "re_xxx"
  },
  "ClientAppUrl": "https://localhost:3000"
}
```

- Connection string points at either the Docker SQL container (1434) or your own SQL Server.
- Cloudinary credentials are required for profile photo uploads.
- Resend `ApiToken` enables the `IEmailSender` to send confirmation links (sign-in requires confirmed email).
- `ClientAppUrl` is used when generating confirmation URLs and should match the Vite dev server.

### Client (`client/.env`)
Create an `.env` file in the client folder:

```
VITE_API_URL=https://localhost:5001/api
VITE_COMMENT_URL=https://localhost:5001/comments
```

- `VITE_API_URL` is the base URL used by Axios. When you publish the SPA inside the API, you can omit this to rely on same-origin `/api`.
- `VITE_COMMENT_URL` must point to the SignalR hub endpoint exposed by the API.

> Never commit `.env` or real secrets. Supply production values with real secret storage (Key Vault, AWS Secrets Manager, etc.).

---

## Local Development

### 1. Start SQL Server (optional)
```bash
docker compose up sql -d
```
- Exposes SQL on `localhost:1434`. Data persists in the `sql-data` volume. Use `docker compose down` (and `-v` to wipe) when finished.

### 2. Run the API
```bash
cd API
dotnet tool restore                             # installs dotnet-ef from manifest if present
dotnet ef database update                       # creates DB + applies migrations + seeds sample data
dotnet watch run                                # launches https://localhost:5001
```

Seeding adds three demo users:
| Email          | Password  | Notes                 |
|----------------|-----------|-----------------------|
| `bob@test.com` | `Pa$$w0rd`| host on several events|
| `tom@test.com` | `Pa$$w0rd`| attendee              |
| `jane@test.com`| `Pa$$w0rd`| attendee/host mix     |

Features exposed by the API:
- `api/activities` CRUD & attendance (with `IsActivityHost` requirement for edits).
- `api/profiles` for profile info, photos, and follower graphs.
- `api/account` and Identity endpoints for registration, login, refresh, email confirmation.
- `/comments` SignalR hub for per-activity chat.

### 3. Run the client
```bash
cd client
npm install
npx vite-plugin-mkcert install    # once, issues local HTTPS certs
npm run dev
```

- Dev server runs on **https://localhost:3000** (see `vite.config.ts`).
- CORS and cookies are configured for `http://localhost:3000` and `https://localhost:3000` in `Program.cs`.
- MobX stores and Axios interceptors rely on cookies (`withCredentials: true`) to keep the Identity session.

---

## Build & Deploy
1. **Build the SPA**
   ```bash
   cd client
   npm run build
   ```
   - Runs TS type-checks + Vite build.
   - Outputs production assets directly into `API/wwwroot`.

2. **Publish the API + SPA**
   ```bash
   cd API
   dotnet publish -c Release -o ../publish
   ```
   - The `publish` folder now contains the ASP.NET Core backend and static assets ready for IIS, Azure App Service, containers, etc.

3. **Migrations**
   - Add new migrations from the `Persistence` project path:
     ```bash
     dotnet ef migrations add <Name> -p Persistence -s API
     ```

---

## Useful Commands
- **Database**
  - `dotnet ef database update` — apply migrations.
  - `dotnet ef migrations add <Name> -p Persistence -s API` — create migration targeting the Persistence project.
- **API**
  - `dotnet watch run` — run with hot reload.
  - `dotnet test` (from solution root) — execute unit/integration tests if added later.
- **Client**
  - `npm run dev` — HTTPS dev server with HMR.
  - `npm run lint` — ESLint + TypeScript rules.
  - `npm run preview` — serve `client/dist` locally before publishing.

---

## Troubleshooting
- **Cannot sign in (401 / email not confirmed)**: Ensure Resend credentials are valid so confirmation emails send, or temporarily disable `RequireConfirmedEmail` in `Program.cs` during local testing.
- **SignalR chat fails to connect**: Check `VITE_COMMENT_URL`, confirm the API is running on HTTPS, and that browser cookies for Identity are present.
- **CORS or cookie issues**: Run both API and client over HTTPS (`dotnet dev-certs https --trust` and `npx vite-plugin-mkcert install`) and verify the allowed origins in `Program.cs`.
- **Photos not uploading**: Verify Cloudinary credentials and folder permissions. Errors propagate from the `PhotoService`.
- **SQL connection errors**: Make sure the Docker container is running (`docker ps`), port 1434 is free, and the SA password matches your connection string.
- **Build assets missing**: `npm run build` replaces `API/wwwroot`. If the directory is read-only or open in another process, the build will fail—rerun after closing conflicting processes.

---

Happy hacking! When you add new services (e.g., background workers, scheduled jobs), update this README plus any CI workflows to keep onboarding friction low.
