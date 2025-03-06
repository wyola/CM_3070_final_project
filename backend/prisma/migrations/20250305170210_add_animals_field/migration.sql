/*
  Warnings:

  - Added the required column `animals` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "krs" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "voivodeship" TEXT NOT NULL,
    "geolocation" TEXT,
    "logo" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "acceptsReports" BOOLEAN NOT NULL DEFAULT false,
    "animals" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Organization" ("acceptsReports", "address", "city", "createdAt", "description", "email", "geolocation", "id", "krs", "logo", "name", "phone", "postalCode", "updatedAt", "voivodeship", "website") SELECT "acceptsReports", "address", "city", "createdAt", "description", "email", "geolocation", "id", "krs", "logo", "name", "phone", "postalCode", "updatedAt", "voivodeship", "website" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
CREATE UNIQUE INDEX "Organization_krs_key" ON "Organization"("krs");
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
