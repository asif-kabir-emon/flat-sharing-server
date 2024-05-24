/*
  Warnings:

  - The primary key for the `otps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `otps` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `otps` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "otps" DROP CONSTRAINT "otps_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "otps_userId_key" ON "otps"("userId");
