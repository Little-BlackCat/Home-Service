-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "recommend" INTEGER;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "stripe_id" TEXT,
ADD COLUMN     "totalprice" INTEGER;

-- AlterTable
ALTER TABLE "Promotions" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);
