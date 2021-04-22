-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userName"  VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userName" VARCHAR(255) NOT NULL,
    "timeOfIncident" TIMESTAMPTZ NOT NULL,
    "type" TEXT,
    "description" VARCHAR(500),
    "coordinates" INTEGER ARRAY,

    PRIMARY KEY ("id"),
    FOREIGN KEY ("userId") REFERENCES "user"("id")
);