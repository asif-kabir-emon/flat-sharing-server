-- AlterTable
ALTER TABLE "flats" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mapLocation" TEXT[],
ADD COLUMN     "photos" TEXT[];

-- CreateTable
CREATE TABLE "user_flats" (
    "flatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_flats_pkey" PRIMARY KEY ("flatId","userId")
);

-- AddForeignKey
ALTER TABLE "user_flats" ADD CONSTRAINT "user_flats_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "flats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_flats" ADD CONSTRAINT "user_flats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
