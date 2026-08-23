-- AlterTable
ALTER TABLE "profiles" ADD COLUMN "email" TEXT NOT NULL,
ADD COLUMN "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
