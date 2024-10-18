-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "role_id" INTEGER NOT NULL,
    "last_seen" DATETIME,
    "token" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "update_at" DATETIME NOT NULL,
    "update_by" INTEGER,
    CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");
-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");