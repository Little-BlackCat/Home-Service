/*
  Warnings:

  - A unique constraint covering the columns `[service_order_id]` on the table `Service_Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Service_Order_service_order_id_key" ON "Service_Order"("service_order_id");
