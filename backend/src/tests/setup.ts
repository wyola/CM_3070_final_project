import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

process.env.NODE_ENV = 'test';

const testDbPath = path.join(__dirname, 'test.db');
process.env.DATABASE_URL = `file:${testDbPath}`;

const prisma = new PrismaClient();

beforeAll(async () => {
  if (fs.existsSync(testDbPath)) {
    try {
      fs.unlinkSync(testDbPath);
      console.log(`Deleted existing test database at ${testDbPath}`);
    } catch (error) {
      console.error(`Error deleting file at ${testDbPath}:`, error);
      throw error;
    }
  }
  
  try {
    execSync('npx prisma db push', { env: process.env });
  } catch (error) {
    console.error('Error setting up test database schema:', error);
    throw error;
  }
});

afterAll(async () => {
  await prisma.$disconnect();
  
  try {
    fs.unlinkSync(testDbPath);
    console.log(`Deleted test database at ${testDbPath}`);
  } catch (error) {
    console.error(`Error deleting file at ${testDbPath}:`, error);
  }
});