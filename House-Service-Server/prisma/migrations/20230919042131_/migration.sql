/*
  Warnings:

  - The primary key for the `Order_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `additional` on the `Order_details` table. All the data in the column will be lost.
  - You are about to drop the column `adress` on the `Order_details` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Order_details` table. All the data in the column will be lost.
  - You are about to drop the column `distric` on the `Order_details` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Order_details` table. All the data in the column will be lost.
  - You are about to drop the column `provice` on the `Order_details` table. All the data in the column will be lost.
  - You are about to drop the column `sub_distric` on the `Order_details` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Order_details` table. All the data in the column will be lost.
  - Added the required column `address` to the `Order_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Order_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Order_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdistrict` to the `Order_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `working_time` to the `Order_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order_details" DROP CONSTRAINT "Order_details_pkey",
DROP COLUMN "additional",
DROP COLUMN "adress",
DROP COLUMN "date",
DROP COLUMN "distric",
DROP COLUMN "id",
DROP COLUMN "provice",
DROP COLUMN "sub_distric",
DROP COLUMN "time",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "details" TEXT,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "order_detail_id" SERIAL NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "subdistrict" TEXT NOT NULL,
ADD COLUMN     "working_time" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Order_details_pkey" PRIMARY KEY ("order_detail_id");

-- CreateTable
CREATE TABLE "Orders" (
    "order_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL DEFAULT 1,
    "order_detail_id" INTEGER NOT NULL,
    "promotion_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Status" (
    "status_id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "Promotions" (
    "promotion_id" SERIAL NOT NULL,
    "promotion_code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quota" INTEGER,
    "discount_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_time" TIMESTAMP(3) NOT NULL,
    "use_count" INTEGER NOT NULL,

    CONSTRAINT "Promotions_pkey" PRIMARY KEY ("promotion_id")
);

-- CreateTable
CREATE TABLE "Service_Order" (
    "service_order_id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "sub_service_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Service_Order_pkey" PRIMARY KEY ("service_order_id")
);

-- CreateTable
CREATE TABLE "Order_Employee" (
    "order_employee_id" SERIAL NOT NULL,
    "order_detail_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "Order_Employee_pkey" PRIMARY KEY ("order_employee_id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employee_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_order_detail_id_key" ON "Orders"("order_detail_id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_promotion_code_key" ON "Orders"("promotion_code");

-- CreateIndex
CREATE UNIQUE INDEX "Promotions_promotion_code_key" ON "Promotions"("promotion_code");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_order_detail_id_fkey" FOREIGN KEY ("order_detail_id") REFERENCES "Order_details"("order_detail_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_promotion_code_fkey" FOREIGN KEY ("promotion_code") REFERENCES "Promotions"("promotion_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service_Order" ADD CONSTRAINT "Service_Order_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service_Order" ADD CONSTRAINT "Service_Order_sub_service_id_fkey" FOREIGN KEY ("sub_service_id") REFERENCES "Sub_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Employee" ADD CONSTRAINT "Order_Employee_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Employee" ADD CONSTRAINT "Order_Employee_order_detail_id_fkey" FOREIGN KEY ("order_detail_id") REFERENCES "Order_details"("order_detail_id") ON DELETE RESTRICT ON UPDATE CASCADE;
