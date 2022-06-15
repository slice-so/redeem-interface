-- CreateTable
CREATE TABLE "Submission" (
    "id" INTEGER NOT NULL,
    "productform_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductForm" (
    "id" SERIAL NOT NULL,
    "slicer_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "slicerId" ON "ProductForm"("slicer_id");

-- CreateIndex
CREATE INDEX "productId" ON "ProductForm"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductForm_slicer_id_product_id_key" ON "ProductForm"("slicer_id", "product_id");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_productform_id_fkey" FOREIGN KEY ("productform_id") REFERENCES "ProductForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
