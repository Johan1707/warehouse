-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "update_at" DATETIME NOT NULL,
    "update_by" INTEGER
);
-- CreateIndex
CREATE UNIQUE INDEX "roles_id_key" ON "roles"("id");
-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");