# AnimalAllies Frontend

This is the frontend application for the AnimalAllies platform, built with React, TypeScript, and Vite.

## Prerequisites

- Node.js >= 20.12.2
- npm or yarn package manager

## Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Components library**: shadcn/ui
- **Styling**: SASS
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Testing**: Vitest + React Testing Library

## Project Setup

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

## Available Scripts

- `npm run dev` - Starts the development server with hot-reload
- `npm run build` - Builds the application for production
- `npm run preview` - Previews the production build locally
- `npm run lint` - Lints the codebase
- `npm test` - Runs all tests
- `npm run test:watch` - Runs tests in watch mode for development

## Testing

The project uses Vitest with React Testing Library for unit testing.

### Test Files Structure

Tests are located next to the components they test with the `.test.tsx` extension.

For example:

- `src/components/CustomSelect/CustomSelect.tsx` - Component
- `src/components/CustomSelect/CustomSelect.test.tsx` - Component tests
