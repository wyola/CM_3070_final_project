# AnimalAllies API Backend

This is the backend service for the AnimalAllies application, built with Node.js, Express.js, and TypeScript.

## Prerequisites

- Node.js >= 20.12.2
- npm or yarn package manager

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite
- **ORM**: Prisma
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Project Setup

1. Install dependencies: `npm install`
2. Apply prisma migrations `npx prisma migrate deploy`
3. Initialize the database: `npx prisma generate`

## Available Scripts

- `npm run build` - Compiles TypeScript code to JavaScript
- `npm run start` - Runs the compiled application
- `npm run dev` - Runs the application in development mode with hot-reload
- `npm test:unit` - Runs unit tests
- `npm test:integration` - Runs integration tests
- `npm test` - Runs all tests
- `npm run test:watch` - Runs tests in watch mode for development
- `npm run test:coverage` - Runs tests and generates coverage report

## Database Management

### Common Prisma Commands

- `npx prisma generate` - Generate Prisma Client - useful to run after applying migrations
- `npx prisma migrate dev` - Create a migration from schema changes
- `npx prisma migrate deploy` - Apply pending migrations
- `npx prisma migrate reset` - Reset database and apply all migrations
- `npx prisma studio` - Open Prisma database GUI

## API Documentation

The API documentation is available through Swagger UI when the application is running:

- Local: http://localhost:3000/api/docs

## Testing

The project uses Jest for unit and integration testing. Tests are located in the `src/tests/` directory and they must have a `.test.ts` extension.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
