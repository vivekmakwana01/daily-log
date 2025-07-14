-- CreateTable
CREATE TABLE "LogEntry" (
    "id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "tags" TEXT[],
    "links" TEXT[],
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("id")
);
