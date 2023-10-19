-- DropForeignKey
ALTER TABLE "Services" DROP CONSTRAINT "Services_category_id_fkey";

-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "updateAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Services" ALTER COLUMN "createAt" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Sub_services" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "sub_service_name" TEXT NOT NULL,
    "price_per_unit" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "Sub_services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sub_services" ADD CONSTRAINT "Sub_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
