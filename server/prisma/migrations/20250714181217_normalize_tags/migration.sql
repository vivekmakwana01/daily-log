/*
  Warnings:

  - You are about to drop the column `tags` on the `LogEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LogEntry" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LogTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LogTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_LogTags_B_index" ON "_LogTags"("B");

-- AddForeignKey
ALTER TABLE "_LogTags" ADD CONSTRAINT "_LogTags_A_fkey" FOREIGN KEY ("A") REFERENCES "LogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LogTags" ADD CONSTRAINT "_LogTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
