/*
  Warnings:

  - You are about to drop the column `userContact` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `userMessage` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `contactNumber` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "userContact",
DROP COLUMN "userMessage",
ADD COLUMN     "contactNumber" TEXT NOT NULL,
ADD COLUMN     "message" TEXT;
