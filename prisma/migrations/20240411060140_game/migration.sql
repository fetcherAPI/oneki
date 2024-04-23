/*
  Warnings:

  - Added the required column `f_team_g_count` to the `game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s_team_g_count` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "game" ADD COLUMN     "f_team_g_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "s_team_g_count" INTEGER NOT NULL DEFAULT 0;
