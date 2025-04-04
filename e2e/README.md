# AnimalAllies E2E tests

## Setup

- `npm install`
- `npx playwright install` - install test browsers

## Running related applications

In order to run e2e tests, both backend and frontend applications needs to be started.

- Frontend - go to `frontend/` directory, and run the application `npm run dev`
- Backend - go to `backend/` directory, and run the application with script `npm run dev:e2e` - this will start the application with clean database.

Important: Every time you run E2E tests, it's recommended to restart the backend application. This will ensure that it has an empty database.

## Scripts

- Run tests `npx playwright test`
- Run tests with UI visible `npx playwright test --ui`
- Show report `npx playwright show-report`
