# AnimalAllies

AnimalAllies is a web application that connects people with animal welfare organizations, enabling reporting of animal abuse, finding and supporting NGOs.

Application was built as Final Project for BSc Computer Science degree at Goldsmiths, University of London.

## Project Structure

- `frontend/` - React + TypeScript + Vite application
- `backend/` - Node.js + Express + TypeScript API
- `e2e/` - Playwright E2E tests
- `data/` - Test data and assets

## Prerequisites

- Node.js >= 20.12.2
- npm

## Quick Start

### Backend Setup

```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

For more details, see [Backend README](backend/README.md)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

For more details, see [Frontend README](frontend/README.md)

### End-to-End Tests Setup

```bash
cd e2e
npm install
npx playwright install
npx playwright test
```

For more details, especially for how to start backend application for E2E tests, see [E2E README](e2e/README)

## Test Data Setup

For development and testing purposes, you can use the provided test data. Follow the instructions in the [Test Data README](data/README.md).

## Available Documentation

- API Documentation: http://localhost:3000/api/docs (when backend is running)
