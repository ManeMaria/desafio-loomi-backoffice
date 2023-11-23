-- CreateTable
CREATE TABLE "order" (
    "id" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "totalOrder" DOUBLE PRECISION NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "clientId" UUID NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
