/*
  Warnings:

  - You are about to drop the column `img` on the `player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `player` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "player" DROP COLUMN "img",
ADD COLUMN     "imgUrl" TEXT,
ADD COLUMN     "nickname" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "player_nickname_key" ON "player"("nickname");
