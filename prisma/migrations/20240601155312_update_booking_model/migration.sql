/*
  Warnings:

  - Added the required column `userContact` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userMessage` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "userContact" TEXT NOT NULL,
ADD COLUMN     "userMessage" TEXT NOT NULL;
