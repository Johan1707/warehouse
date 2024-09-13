-- CreateTable
CREATE TABLE "menus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "route" TEXT DEFAULT '#',
    "icon" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "style" TEXT,
    "menu_id" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "update_at" DATETIME NOT NULL,
    "update_by" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "menus_id_key" ON "menus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "menus_title_route_menu_id_key" ON "menus"("title", "route", "menu_id");

