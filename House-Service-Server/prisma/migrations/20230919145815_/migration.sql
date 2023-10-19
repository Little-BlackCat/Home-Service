-- CreateTable
CREATE TABLE "thai_amphures" (
    "id" INTEGER NOT NULL,
    "name_th" TEXT,
    "name_en" TEXT,
    "province_id" INTEGER NOT NULL,
    "created_at" TEXT,
    "updated_at" TEXT,
    "deleted_at" TEXT,

    CONSTRAINT "thai_amphures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thai_provinces" (
    "id" INTEGER NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT,
    "geography_id" INTEGER,
    "created_at" TEXT,
    "updated_at" TEXT,
    "deleted_at" TEXT,

    CONSTRAINT "thai_provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thai_tambons" (
    "id" INTEGER NOT NULL,
    "zip_code" INTEGER,
    "name_th" TEXT,
    "name_en" TEXT,
    "amphure_id" INTEGER NOT NULL,
    "created_at" TEXT,
    "updated_at" TEXT,
    "deleted_at" TEXT,

    CONSTRAINT "thai_tambons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "thai_amphures" ADD CONSTRAINT "thai_amphures_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "thai_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thai_tambons" ADD CONSTRAINT "thai_tambons_amphure_id_fkey" FOREIGN KEY ("amphure_id") REFERENCES "thai_amphures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
