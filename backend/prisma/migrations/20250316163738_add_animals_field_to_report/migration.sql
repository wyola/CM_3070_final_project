/*
  Warnings:

  - Added the required column `animals` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "geolocation" TEXT NOT NULL,
    "image" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "animals" TEXT NOT NULL
);
INSERT INTO "new_Report" ("address", "city", "contactEmail", "contactName", "contactPhone", "createdAt", "description", "geolocation", "id", "image", "postalCode", "status", "title", "updatedAt") SELECT "address", "city", "contactEmail", "contactName", "contactPhone", "createdAt", "description", "geolocation", "id", "image", "postalCode", "status", "title", "updatedAt" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
