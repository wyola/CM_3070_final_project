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

## Image Credits

### Icons
UICONS Straight Thin by UIcons
https://www.freepik.com/author/uicons/icons/uicons-straight-thin_5091

### Logo
with changed colors
https://www.freepik.com/icon/socialization_16823782

### Homepage image
Image by storyset on Freepik
https://www.freepik.com/free-vector/good-doggy-concept-illustration_20135123.htm

### Homepage, Organization page - when no results / failed to load
Image by storyset on Freepik
https://www.freepik.com/free-vector/cautious-dog-concept-illustration_12832201.htm

### Registration form
Image by storyset on Freepik
https://www.freepik.com/free-vector/dog-high-five-concept-illustration_31197047.htm

