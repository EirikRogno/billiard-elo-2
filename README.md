# Webstep Billiard ELO Rating

Live at: <https://webstep-biljard.rogno.no/>

An internal app for Webstep employees to track billiard match results and player ratings using the ELO rating system.

## Features

- ELO-based leaderboard that updates after every match
- Register match results between two players
- Full match history with ELO deltas
- Head-to-head player comparison
- Google OAuth login (Webstep accounts)

## Tech Stack

| Layer    | Choice                                |
| -------- | ------------------------------------- |
| Frontend | React 19 + React Router v7 (SSR)      |
| Database | PostgreSQL + Drizzle ORM              |
| Auth     | better-auth (Google OAuth)            |
| Styling  | Tailwind CSS 4 + Radix UI + shadcn/ui |

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
DATABASE_URL=          # PostgreSQL connection string
BETTER_AUTH_URL=       # Base URL for auth callbacks (e.g. http://localhost:3000)
GOOGLE_CLIENT_ID=      # Google OAuth client ID
GOOGLE_CLIENT_SECRET=  # Google OAuth client secret
```

### Database Setup

Run the initial migration to create all tables:

```bash
npm run db:migrate
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

The app will be available at <http://localhost:3000>.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The application is hosted on **Azure Container Apps**. Deployment is managed centrally — if you need something deployed, contact [@EirikRogno](https://github.com/EirikRogno).

### Building the Docker Image

To build and run the container locally:

```bash
docker build -t billiard-elo .
docker run -p 3000:3000 --env-file .env billiard-elo
```

### Deploying to Azure

Deployment to Azure Container Apps is handled by the project maintainer. Open an issue or reach out to [@EirikRogno](https://github.com/EirikRogno) to request a deployment.

## Database Schema Changes

After modifying `database/schema.ts`, regenerate and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```
