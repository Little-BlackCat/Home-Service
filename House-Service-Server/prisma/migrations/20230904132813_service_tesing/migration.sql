-- CreateTable
CREATE TABLE "Customer_profile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Customer_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order_details" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "time" TIME NOT NULL,
    "adress" TEXT NOT NULL,
    "sub_distric" TEXT NOT NULL,
    "distric" TEXT NOT NULL,
    "provice" TEXT NOT NULL,
    "additional" TEXT,

    CONSTRAINT "Order_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" SERIAL NOT NULL,
    "service_name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "pic_service" TEXT NOT NULL,
    "createAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_profile_phone_key" ON "Customer_profile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_profile_email_key" ON "Customer_profile"("email");

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
