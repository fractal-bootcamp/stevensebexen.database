-- CreateTable
CREATE TABLE "Sauce" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "spiciness" INTEGER NOT NULL,

    CONSTRAINT "Sauce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pepper" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "spiciness" INTEGER NOT NULL,

    CONSTRAINT "Pepper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeppersInSauce" (
    "sauceId" INTEGER NOT NULL,
    "pepperId" INTEGER NOT NULL,

    CONSTRAINT "PeppersInSauce_pkey" PRIMARY KEY ("sauceId","pepperId")
);

-- AddForeignKey
ALTER TABLE "PeppersInSauce" ADD CONSTRAINT "PeppersInSauce_sauceId_fkey" FOREIGN KEY ("sauceId") REFERENCES "Sauce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeppersInSauce" ADD CONSTRAINT "PeppersInSauce_pepperId_fkey" FOREIGN KEY ("pepperId") REFERENCES "Pepper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
