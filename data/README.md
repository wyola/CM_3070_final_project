# Test Data Setup Instructions

This directory contains initial test data and respective assets for the application. Using it allows testing functionality without having to create data manually.

## How to use it

1. Make sure your backend server is not running
2. Copy the files to their respective locations:

   - Copy `sqlite.db` file into the `backend/prisma/src/database` directory
   - Copy all contents from the `uploads` folder into the `backend/uploads/` directory

3. Start your backend server

## Important Notes

- The SQLite database contains pre-configured test data
- The uploads directory contains files that are referenced in the database
- Always make a backup of your existing data before copying these files
- These files are meant for testing/development purposes only
