-- CreateTable
CREATE TABLE "game_metrics" (
  "id" TEXT NOT NULL,
  "gameId" TEXT NOT NULL,
  "views" INTEGER NOT NULL DEFAULT 0,
  "plays" INTEGER NOT NULL DEFAULT 0,
  "likes" INTEGER NOT NULL DEFAULT 0,
  "dislikes" INTEGER NOT NULL DEFAULT 0,
  "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "game_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_metrics_gameId_key" ON "game_metrics"("gameId");

-- AddForeignKey
ALTER TABLE "game_metrics" ADD CONSTRAINT "game_metrics_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE; 