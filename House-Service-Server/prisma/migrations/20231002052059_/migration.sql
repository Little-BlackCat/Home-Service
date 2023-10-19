/*
  Warnings:

  - A unique constraint covering the columns `[order_detail_id]` on the table `Order_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Order_details_order_detail_id_key" ON "Order_details"("order_detail_id");
